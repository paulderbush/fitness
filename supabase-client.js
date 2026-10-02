// ============ SUPABASE CLIENT (config fetched from the server at runtime) ============
// Shared by index.html, account.html and program.html.
let sb = null;
const sbReady = (async () => {
  try {
    const res = await fetch('/api/public-config');
    if(!res.ok) return;
    const cfg = await res.json();
    if(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase){
      sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
    }
  } catch(e){
    console.error('Supabase init failed', e);
  }
})();

// ============ STRIPE CHECKOUT ============
async function startCheckout(email, userId){
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, userId }),
  });
  let data = {};
  try { data = await res.json(); } catch(e){ /* non-JSON response */ }
  if(!res.ok || !data.url){
    throw new Error(data.error || 'Could not start checkout.');
  }
  window.location.href = data.url;
}
