// Client-side access gate: only reveal this page's content to a logged-in
// user with an active subscription. Anyone else (including a direct link
// shared by someone who does have access) is redirected to the homepage.
// This isn't a hard security boundary (the markup is still fetchable), but
// there's no real paid content on the page yet - just a placeholder.
async function checkProgramAccess(){
  await sbReady;
  if(!sb){
    window.location.href = 'index.html';
    return;
  }

  const { data:{ session } } = await sb.auth.getSession();
  if(!session){
    window.location.href = 'index.html';
    return;
  }

  try {
    const res = await fetch('/api/subscription-status', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();
    if(!data.active){
      window.location.href = 'index.html';
      return;
    }
  } catch(e){
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('gateLoading').hidden = true;
  document.getElementById('gateContent').hidden = false;
}

document.addEventListener('DOMContentLoaded', checkProgramAccess);
