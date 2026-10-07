const Stripe = require('stripe');

// Non-trial plans map straight to a single recurring Stripe Price each.
// The trial plan (see below) uses its own two-line-item flow instead.
const PLAN_PRICE_ENV = {
  monthly: 'STRIPE_PRICE_MONTHLY',
  '6month': 'STRIPE_PRICE_6MONTH',
  annual: 'STRIPE_PRICE_ANNUAL',
};

module.exports = async (req, res) => {
  if(req.method !== 'POST'){
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if(!process.env.STRIPE_SECRET_KEY){
    return res.status(500).json({ error: 'Stripe is not configured yet.' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { email, userId, plan } = req.body || {};
    if(!email || !userId){
      return res.status(400).json({ error: 'Missing email or userId' });
    }

    const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;
    const success_url = `${siteUrl}/account.html?checkout=success`;
    const cancel_url = `${siteUrl}/?checkout=cancelled`;

    let session;
    if(plan && plan !== 'trial'){
      const priceEnvName = PLAN_PRICE_ENV[plan];
      const priceId = priceEnvName && process.env[priceEnvName];
      if(!priceId){
        return res.status(400).json({ error: 'That plan is not available yet.' });
      }
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: email,
        client_reference_id: userId,
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: { metadata: { supabase_user_id: userId } },
        metadata: { supabase_user_id: userId },
        success_url,
        cancel_url,
      });
    } else {
      // One-time €2.99 trial fee + a recurring monthly price, with the
      // recurring price's first charge delayed by the trial period —
      // this is Stripe's standard "paid trial" pattern.
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: email,
        client_reference_id: userId,
        line_items: [
          { price: process.env.STRIPE_PRICE_TRIAL_FEE, quantity: 1 },
          { price: process.env.STRIPE_PRICE_MONTHLY, quantity: 1 },
        ],
        subscription_data: {
          trial_period_days: 10,
          metadata: { supabase_user_id: userId },
        },
        metadata: { supabase_user_id: userId },
        success_url,
        cancel_url,
      });
    }

    res.status(200).json({ url: session.url });
  } catch(err){
    console.error('create-checkout-session error', err);
    res.status(500).json({ error: err.message || 'Could not start checkout.' });
  }
};
