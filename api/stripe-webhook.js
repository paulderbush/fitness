const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Stripe needs the raw, unparsed request body to verify the webhook signature.
module.exports.config = { api: { bodyParser: false } };

function readRawBody(req){
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function upsertSubscription(subscription){
  if(!supabaseAdmin) return;
  const userId = subscription.metadata && subscription.metadata.supabase_user_id;
  if(!userId) return;
  await supabaseAdmin.from('subscriptions').upsert({
    user_id: userId,
    stripe_customer_id: subscription.customer,
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  });
}

module.exports = async (req, res) => {
  if(req.method !== 'POST'){
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  if(!process.env.STRIPE_WEBHOOK_SECRET || !process.env.STRIPE_SECRET_KEY){
    console.error('stripe-webhook: Stripe env vars are not configured');
    return res.status(500).end();
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch(err){
    console.error('stripe-webhook: signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch(event.type){
      case 'checkout.session.completed': {
        const session = event.data.object;
        if(session.mode === 'subscription' && session.subscription){
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          await upsertSubscription(subscription);
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        await upsertSubscription(event.data.object);
        break;
      }
      default:
        break;
    }
    res.status(200).json({ received: true });
  } catch(err){
    console.error('stripe-webhook: handler error', err);
    res.status(500).json({ error: err.message });
  }
};
