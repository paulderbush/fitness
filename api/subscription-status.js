const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

const ACTIVE_STATUSES = ['active', 'trialing'];

module.exports = async (req, res) => {
  if(!supabaseAdmin){
    return res.status(500).json({ error: 'Supabase is not configured yet.' });
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

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('status, current_period_end, cancel_at_period_end')
      .eq('user_id', userData.user.id)
      .maybeSingle();

    if(error) throw error;

    const active = !!data && ACTIVE_STATUSES.includes(data.status);
    res.status(200).json({
      active,
      status: data ? data.status : 'none',
      currentPeriodEnd: data ? data.current_period_end : null,
      cancelAtPeriodEnd: data ? !!data.cancel_at_period_end : false,
    });
  } catch(err){
    console.error('subscription-status error', err);
    res.status(500).json({ error: err.message || 'Could not load subscription status.' });
  }
};
