const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

module.exports = async (req, res) => {
  if(req.method !== 'POST'){
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if(!supabaseAdmin || !process.env.STRIPE_SECRET_KEY){
    return res.status(500).json({ error: 'Service is not configured yet.' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if(!token){
    return res.status(401).json({ error: 'Missing session token' });
  }

  try {
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if(userError || !userData || !userData.user){
      return res.status(401).json({ error: 'Invalid session' });
    }

    const { data: sub, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if(subError) throw subError;
    if(!sub || !sub.stripe_subscription_id){
      return res.status(404).json({ error: 'No subscription found for this account.' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const updated = await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    await supabaseAdmin.from('subscriptions').update({
      status: updated.status,
      cancel_at_period_end: updated.cancel_at_period_end,
      current_period_end: new Date(updated.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('user_id', userData.user.id);

    res.status(200).json({
      ok: true,
      cancelAtPeriodEnd: updated.cancel_at_period_end,
      currentPeriodEnd: updated.current_period_end,
    });
  } catch(err){
    console.error('cancel-subscription error', err);
    res.status(500).json({ error: err.message || 'Could not cancel subscription.' });
  }
};
