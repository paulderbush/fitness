// Supabase delivers the recovery link with a token in the URL; its JS
// client exchanges that for a short-lived session during initialization.
// We just wait for either a session to show up or a timeout, then show
// the right state.
async function initResetPage(){
  await sbReady;
  const checking = document.getElementById('resetChecking');
  const invalid = document.getElementById('resetInvalid');
  const form = document.getElementById('resetForm');
  const done = document.getElementById('resetDone');
  const passwordInput = document.getElementById('resetPassword');
  const submitBtn = document.getElementById('resetSubmit');

  if(!sb){
    checking.textContent = bmT('auth.service_unavailable');
    return;
  }

  function showInvalid(){
    checking.hidden = true;
    invalid.hidden = false;
  }
  function showForm(){
    checking.hidden = true;
    form.hidden = false;
  }

  const { data:{ session } } = await sb.auth.getSession();
  if(session){
    showForm();
  } else {
    const recoverySession = await new Promise(resolve => {
      const { data:{ subscription } } = sb.auth.onAuthStateChange((event, session) => {
        if(session){
          subscription.unsubscribe();
          resolve(session);
        }
      });
      setTimeout(() => { subscription.unsubscribe(); resolve(null); }, 2500);
    });
    if(recoverySession) showForm(); else showInvalid();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = passwordInput.value;
    if(!password || password.length < 6){
      passwordInput.style.borderColor = '#C1587A';
      return;
    }
    passwordInput.style.borderColor = '';
    submitBtn.disabled = true;
    submitBtn.textContent = bmT('acct.saving');

    const { error } = await sb.auth.updateUser({
      password,
      data: { password_set: true },
    });
    if(error){
      submitBtn.disabled = false;
      submitBtn.textContent = bmT('reset.submit');
      alert(error.message);
      return;
    }

    form.hidden = true;
    done.hidden = false;
  });
}

document.addEventListener('DOMContentLoaded', initResetPage);
