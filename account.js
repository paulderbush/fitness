function formatDate(iso){
  if(!iso) return '';
  return new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });
}

function daysLeft(iso){
  if(!iso) return 0;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function setProgramCardLocked(locked){
  const programCard = document.getElementById('programCard');
  const programCardCta = document.getElementById('programCardCta');
  programCard.classList.toggle('locked', locked);
  programCard.href = locked ? 'index.html#signup' : 'program.html';
  programCardCta.textContent = locked ? 'Join Now' : 'Start Training';
}

async function refreshStatus(session){
  const dashboardStatus = document.getElementById('dashboardStatus');
  const dashboardContent = document.getElementById('dashboardContent');

  dashboardStatus.textContent = 'Checking subscription…';
  dashboardContent.innerHTML = '';

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

      setProgramCardLocked(false);
    } else {
      dashboardStatus.innerHTML = '<span class="status-badge status-inactive">No active subscription</span>';
      dashboardContent.innerHTML = '<button class="btn btn-pill btn-primary btn-block" id="subscribeBtn" type="button">Subscribe for €19.99/month</button>';
      setProgramCardLocked(true);
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
    }
  } catch(e){
    dashboardStatus.textContent = 'Could not load subscription status.';
  }
}

function updateEmailDisplay(user){
  const name = user.user_metadata && user.user_metadata.name;
  document.getElementById('dashboardEmail').textContent = name ? `Hi, ${name} (${user.email})` : user.email;
}

// Members who signed up straight into checkout (see setupSignup in
// script.js) don't have a password yet - their account was created with a
// throwaway one. Block the dashboard behind this one-time step so they set
// their own password (and optionally a name) before using the account page.
function needsOnboarding(session){
  return !(session.user.user_metadata && session.user.user_metadata.password_set);
}

function setupOnboarding(session){
  const card = document.getElementById('onboardingCard');
  const dashboardCard = document.getElementById('dashboardCard');
  const nameInput = document.getElementById('onboardingName');
  const passwordInput = document.getElementById('onboardingPassword');
  const saveBtn = document.getElementById('onboardingSaveBtn');
  const defaultLabel = saveBtn.textContent;

  card.style.display = '';
  dashboardCard.style.display = 'none';

  saveBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const password = passwordInput.value;
    if(!password || password.length < 6){
      passwordInput.style.borderColor = '#C1587A';
      return;
    }
    passwordInput.style.borderColor = '';
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';

    const { data, error } = await sb.auth.updateUser({
      password,
      data: { password_set: true, name: name || undefined },
    });
    if(error){
      saveBtn.disabled = false;
      saveBtn.textContent = defaultLabel;
      alert(error.message);
      return;
    }

    updateEmailDisplay(data.user);
    card.style.display = 'none';
    dashboardCard.style.display = '';
    await refreshStatus(session);
  });
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

  updateEmailDisplay(session.user);
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await sb.auth.signOut();
    window.location.href = 'index.html';
  });

  if(needsOnboarding(session)){
    setupOnboarding(session);
  } else {
    document.getElementById('dashboardCard').style.display = '';
    await refreshStatus(session);
  }
}

document.addEventListener('DOMContentLoaded', initAccountPage);
