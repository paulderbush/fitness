function formatDate(iso){
  if(!iso) return '';
  const locale = bmCurrentLang() === 'ru' ? 'ru-RU' : 'en-GB';
  return new Date(iso).toLocaleDateString(locale, { day:'numeric', month:'long', year:'numeric' });
}

function daysLeft(iso){
  if(!iso) return 0;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function dayWord(n){
  if(bmCurrentLang() === 'ru'){
    const mod10 = n % 10;
    const mod100 = n % 100;
    if(mod10 === 1 && mod100 !== 11) return bmT('acct.day_1');
    if(mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return bmT('acct.day_few');
    return bmT('acct.day_other');
  }
  return n === 1 ? bmT('acct.day_1') : bmT('acct.day_other');
}

function setProgramCardLocked(locked){
  const programCard = document.getElementById('programCard');
  const programCardCta = document.getElementById('programCardCta');
  programCard.classList.toggle('locked', locked);
  programCard.href = locked ? 'index.html#signup' : 'program.html';
  programCardCta.textContent = locked ? bmT('acct.join_now') : bmT('acct.start_training');
}

async function refreshStatus(session){
  const dashboardStatus = document.getElementById('dashboardStatus');
  const dashboardContent = document.getElementById('dashboardContent');

  dashboardStatus.textContent = bmT('acct.checking');
  dashboardContent.innerHTML = '';

  try {
    const res = await fetch('/api/subscription-status', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await res.json();

    if(data.active){
      dashboardStatus.innerHTML = `<span class="status-badge status-active">${bmT('acct.active_badge')}</span>`;
      const left = daysLeft(data.currentPeriodEnd);
      const endDate = formatDate(data.currentPeriodEnd);
      const word = dayWord(left);

      if(data.cancelAtPeriodEnd){
        dashboardContent.innerHTML = `<p class="dashboard-placeholder">${bmT('acct.cancel_scheduled', { date:endDate, left, dayWord:word })}</p>`;
      } else {
        dashboardContent.innerHTML = `
          <p class="dashboard-renew">${bmT('acct.renews', { left, dayWord:word, date:endDate })}</p>
          <button class="btn btn-ghost btn-sm" id="cancelSubBtn" type="button">${bmT('acct.cancel_btn')}</button>
        `;
        document.getElementById('cancelSubBtn').addEventListener('click', async () => {
          const btn = document.getElementById('cancelSubBtn');
          if(!confirm(bmT('acct.confirm_cancel', { date:endDate }))) return;
          btn.disabled = true;
          btn.textContent = bmT('acct.cancelling');
          try {
            const cRes = await fetch('/api/cancel-subscription', {
              method: 'POST',
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const cData = await cRes.json();
            if(!cRes.ok) throw new Error(cData.error || bmT('acct.cancel_error'));
            await refreshStatus(session);
          } catch(err){
            alert(err.message);
            btn.disabled = false;
            btn.textContent = bmT('acct.cancel_btn');
          }
        });
      }

      setProgramCardLocked(false);
    } else {
      dashboardStatus.innerHTML = `<span class="status-badge status-inactive">${bmT('acct.inactive_badge')}</span>`;
      dashboardContent.innerHTML = `<button class="btn btn-pill btn-primary btn-block" id="subscribeBtn" type="button">${bmT('acct.subscribe_btn')}</button>`;
      setProgramCardLocked(true);
      document.getElementById('subscribeBtn').addEventListener('click', async () => {
        const btn = document.getElementById('subscribeBtn');
        btn.disabled = true;
        btn.textContent = bmT('signup.redirecting');
        try {
          await startCheckout(session.user.email, session.user.id);
        } catch(err){
          alert(err.message);
          btn.disabled = false;
          btn.textContent = bmT('acct.subscribe_btn');
        }
      });
    }
  } catch(e){
    dashboardStatus.textContent = bmT('acct.load_error');
  }
}

function updateEmailDisplay(user){
  const name = user.user_metadata && user.user_metadata.name;
  document.getElementById('dashboardEmail').textContent = name ? bmT('acct.hi', { name, email:user.email }) : user.email;
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
    saveBtn.textContent = bmT('acct.saving');

    const { data, error } = await sb.auth.updateUser({
      password,
      data: { password_set: true, name: name || undefined },
    });
    if(error){
      saveBtn.disabled = false;
      saveBtn.textContent = bmT('acct.save_continue');
      alert(error.message);
      return;
    }

    updateEmailDisplay(data.user);
    card.style.display = 'none';
    dashboardCard.style.display = '';
    await refreshStatus(session);
  });
}

let currentAccountSession = null;

async function initAccountPage(){
  await sbReady;
  const dashboardStatus = document.getElementById('dashboardStatus');
  if(!sb){
    dashboardStatus.textContent = bmT('auth.service_unavailable');
    return;
  }

  const { data:{ session } } = await sb.auth.getSession();
  if(!session){
    window.location.href = 'index.html';
    return;
  }
  currentAccountSession = session;

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

// Re-render the parts of the dashboard this script wrote in the previous
// language when the person switches languages via the nav lang-switch.
document.addEventListener('bm:langchange', () => {
  if(!currentAccountSession) return;
  updateEmailDisplay(currentAccountSession.user);
  const dashboardCard = document.getElementById('dashboardCard');
  if(dashboardCard && dashboardCard.style.display !== 'none'){
    refreshStatus(currentAccountSession);
  }
});
