function formatDate(iso){
  if(!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
}

function daysLeft(iso){
  if(!iso) return 0;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

async function refreshStatus(session){
  const dashboardStatus = document.getElementById('dashboardStatus');
  const dashboardContent = document.getElementById('dashboardContent');
  const programsList = document.getElementById('programsList');

  dashboardStatus.textContent = 'Checking subscription…';
  dashboardContent.innerHTML = '';
  programsList.innerHTML = '';

  try {
    const res = await fetch('/api/subscription-status', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();

    if(data.active){
      dashboardStatus.innerHTML = '<span class="status-badge status-active">Active subscription</span>';
      const left = daysLeft(data.currentPeriodEnd);
      const endDate = formatDate(data.currentPeriodEnd);
      const dayWord = left === 1 ? 'day' : 'days';

      if(data.cancelAtPeriodEnd){
        dashboardContent.innerHTML = `<p class="dashboard-placeholder">Your subscription is set to cancel and will stay active until <b>${endDate}</b> (${left} ${dayWord} left). You won't be charged again.</p>`;
      } else {
        dashboardContent.innerHTML = `
          <p class="dashboard-renew">Renews in <b>${left} ${dayWord}</b> (on ${endDate}).</p>
          <button class="btn btn-ghost btn-sm" id="cancelSubBtn" type="button">Cancel subscription</button>
        `;
        document.getElementById('cancelSubBtn').addEventListener('click', async () => {
          const btn = document.getElementById('cancelSubBtn');
          if(!confirm(`Cancel your subscription? You'll keep access until ${endDate}.`)) return;
          btn.disabled = true;
          btn.textContent = 'Cancelling…';
          try {
            const cRes = await fetch('/api/cancel-subscription', {
              method: 'POST',
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const cData = await cRes.json();
            if(!cRes.ok) throw new Error(cData.error || 'Could not cancel subscription.');
            await refreshStatus(session);
          } catch(err){
            alert(err.message);
            btn.disabled = false;
            btn.textContent = 'Cancel subscription';
          }
        });
      }

      programsList.innerHTML = `
        <a href="program.html" class="account-program-card">
          <span class="account-program-name">Body Muse Program</span>
          <span class="account-program-cta">View Program →</span>
        </a>
      `;
    } else {
      dashboardStatus.innerHTML = '<span class="status-badge status-inactive">No active subscription</span>';
      dashboardContent.innerHTML = '<button class="btn btn-pill btn-primary btn-block" id="subscribeBtn" type="button">Subscribe for €19.99/month</button>';
      document.getElementById('subscribeBtn').addEventListener('click', async () => {
        const btn = document.getElementById('subscribeBtn');
        btn.disabled = true;
        btn.textContent = 'Redirecting to secure payment…';
        try {
          await startCheckout(session.user.email, session.user.id);
        } catch(err){
          alert(err.message);
          btn.disabled = false;
          btn.textContent = 'Subscribe for €19.99/month';
        }
      });
      programsList.innerHTML = '<p class="account-locked">Subscribe to unlock your program.</p>';
    }
  } catch(e){
    dashboardStatus.textContent = 'Could not load subscription status.';
  }
}

async function initAccountPage(){
  await sbReady;
  const dashboardStatus = document.getElementById('dashboardStatus');
  if(!sb){
    dashboardStatus.textContent = 'Account service is temporarily unavailable.';
    return;
  }

  const { data:{ session } } = await sb.auth.getSession();
  if(!session){
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('dashboardEmail').textContent = session.user.email;
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await sb.auth.signOut();
    window.location.href = 'index.html';
  });

  await refreshStatus(session);
}

document.addEventListener('DOMContentLoaded', initAccountPage);
