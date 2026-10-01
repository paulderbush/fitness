// ============ FAQ DATA ============
const FAQ = [
  { q:"Is this program right for beginners or advanced users?", a:"The program is designed for both beginners and experienced women. Every workout includes adjustable intensity levels, allowing you to train at the pace that's right for you while progressing safely over time." },
  { q:"I'm over 40. Is this program right for me?", a:"Absolutely. Your body can become stronger, leaner, and healthier at any age. The program adapts to your fitness level so you can train safely and continue making progress." },
  { q:"Can I do this program after pregnancy?", a:"Yes, if your doctor has cleared you to exercise. The workouts can be adapted to your current level and gradually increased as your body gets stronger." },
  { q:"What if I have back pain or poor posture?", a:"Strong muscles help support good posture. Along with the main program, you'll have access to posture-focused workouts designed to strengthen your back and core, and improve the way you move." },
  { q:"What if I don't have enough motivation?", a:"You don't need more motivation — you need a system. Our step-by-step program tells you exactly what to do every day, so you never have to guess. Many members notice their first positive changes within the first 10 days, which makes it much easier to stay motivated." },
  { q:"What if I don't have enough time?", a:"Each workout takes just 20 minutes. We recommend training at least four times a week — that's only 1.5 hours per week. You and your body definitely deserve it." },
  { q:"How much weight can I lose?", a:"Weight loss depends on many factors, including your starting point, nutrition, sleep, and consistency. For many people, a gradual loss of around 5% of body weight over time is considered a safe and realistic pace, though individual results vary." },
  { q:"What if I don't get results?", a:"We're confident in our system. If you follow the workouts and nutrition plan as instructed for 30 days and don't see measurable progress, we'll refund your money according to our guarantee policy." },
  { q:"Do I need a gym?", a:"No. Every workout can be completed at home." },
  { q:"Do I need equipment?", a:"Most workouts require no equipment at all. Some optional programs use resistance bands to increase training variety and intensity." },
  { q:"Do I need to follow a strict diet?", a:"No — we don't believe in restrictive diets. Instead, we teach a balanced, sustainable approach to nutrition that supports your health, energy, and long-term body transformation." },
  { q:"Will I get meal plans and recipes?", a:"Yes. Your membership includes personalized nutrition plans and a large collection of healthy, delicious recipes that are easy to prepare and fit into everyday life." },
  { q:"Why should I trust this program?", a:"This isn't a random collection of workouts — it's a complete body transformation system created specifically for women, combining evidence-based training, personalized nutrition, healthy recipes, and progressive programs designed to help you lose weight, tone your body, improve your posture, and build habits that last." },
  { q:"Is this just another workout app?", a:"No — it's a complete transformation platform. Inside your membership you'll find step-by-step workout systems, weight loss programs, posture correction, flat stomach and glute programs, personalized nutrition plans, hundreds of healthy recipes, and new content added regularly. Everything you need is in one place." },
  { q:"Why should I start today instead of waiting?", a:"Because every week you wait is another week without progress. For just €2.99, you can start today, experience the full program, and see whether it's the right fit for you — with virtually no risk, thanks to our 30-Day Results Guarantee." },
];

function renderFAQ(){
  const wrap = document.getElementById('faqList');
  wrap.innerHTML = '';
  FAQ.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'faq-item' + (i === 0 ? ' open' : '');
    el.innerHTML = `
      <div class="faq-q">
        <span>${item.q}</span>
        <span class="plus">+</span>
      </div>
      <div class="faq-a"><div class="faq-a-inner">${item.a}</div></div>
    `;
    const q = el.querySelector('.faq-q');
    const a = el.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = el.classList.contains('open');
      wrap.querySelectorAll('.faq-item.open').forEach(openEl => {
        openEl.classList.remove('open');
        openEl.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        el.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
    wrap.appendChild(el);
  });
  // set initial open height after render
  const first = wrap.querySelector('.faq-item.open .faq-a');
  if(first) first.style.maxHeight = first.scrollHeight + 'px';
}

// ============ COUNTDOWN TO MIDNIGHT ============
function updateCountdown(){
  const el = document.getElementById('countdownTimer');
  if(!el) return;
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24,0,0,0);
  const diff = midnight - now;
  const h = String(Math.floor(diff / 3600000)).padStart(2,'0');
  const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  const s = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
  el.textContent = `${h}:${m}:${s}`;
}

// ============ STICKY BAR ============
function setupStickyBar(){
  const bar = document.getElementById('stickyBar');
  const hero = document.querySelector('.hero');
  if(!bar || !hero) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      bar.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { threshold:0 });
  io.observe(hero);
}

// ============ TOPBAR OVER HERO ============
function setupTopbarOverHero(){
  const topbar = document.getElementById('topbar');
  const hero = document.querySelector('.hero');
  if(!topbar || !hero) return;
  function update(){
    topbar.classList.toggle('scrolled', window.scrollY >= 15);
  }
  update();
  window.addEventListener('scroll', update, { passive:true });
  window.addEventListener('resize', update);
}

// ============ POPUP (once per session, after 5s) ============
function setupPopup(){
  const overlay = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('popupClose');
  const cta = document.getElementById('popupCta');
  if(!overlay) return;

  const alreadyShown = sessionStorage.getItem('bm_popup_shown');
  if(!alreadyShown){
    setTimeout(() => {
      overlay.classList.add('visible');
      sessionStorage.setItem('bm_popup_shown', '1');
    }, 5000);
  }

  function hide(){ overlay.classList.remove('visible'); }
  closeBtn.addEventListener('click', hide);
  overlay.addEventListener('click', (e) => { if(e.target === overlay) hide(); });
  cta.addEventListener('click', hide);
}

// ============ MOBILE FULL-SCREEN MENU ============
function setupMobileMenu(){
  const menuBtn = document.getElementById('menuBtn');
  const overlay = document.getElementById('mobileMenuOverlay');
  if(!menuBtn || !overlay) return;

  function open(){
    overlay.classList.add('visible');
    menuBtn.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    overlay.classList.remove('visible');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', () => {
    if(overlay.classList.contains('visible')) close(); else open();
  });
  overlay.querySelectorAll('a, button').forEach(el => el.addEventListener('click', close));
}

// ============ SUPABASE CLIENT (config fetched from the server at runtime) ============
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

// ============ ACCOUNT: AUTH POPUP + DASHBOARD ============
function setupAccount(){
  const authOverlay = document.getElementById('accountPopupOverlay');
  const authClose = document.getElementById('accountPopupClose');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForm = document.getElementById('authForm');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const authSubmit = document.getElementById('authSubmit');
  const authError = document.getElementById('authError');

  const dashboardOverlay = document.getElementById('dashboardOverlay');
  const dashboardClose = document.getElementById('dashboardClose');
  const dashboardEmail = document.getElementById('dashboardEmail');
  const dashboardStatus = document.getElementById('dashboardStatus');
  const dashboardContent = document.getElementById('dashboardContent');
  const logoutBtn = document.getElementById('logoutBtn');

  const accountButtons = [document.getElementById('accountBtn'), document.getElementById('accountBtnMobile')].filter(Boolean);
  if(!authOverlay || !dashboardOverlay || accountButtons.length === 0) return;

  let authTab = 'login';

  function setAuthTab(tab){
    authTab = tab;
    authTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    authSubmit.textContent = tab === 'signup' ? 'Sign Up' : 'Log In';
    authPassword.autocomplete = tab === 'signup' ? 'new-password' : 'current-password';
    authError.hidden = true;
  }
  authTabs.forEach(t => t.addEventListener('click', () => setAuthTab(t.dataset.tab)));

  function openAuth(){
    setAuthTab('login');
    authForm.reset();
    authOverlay.classList.add('visible');
  }
  function closeAuth(){ authOverlay.classList.remove('visible'); }
  authClose.addEventListener('click', closeAuth);
  authOverlay.addEventListener('click', (e) => { if(e.target === authOverlay) closeAuth(); });

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await sbReady;
    if(!sb){
      authError.textContent = 'Account service is temporarily unavailable. Please try again shortly.';
      authError.hidden = false;
      return;
    }
    const email = authEmail.value.trim();
    const password = authPassword.value;
    authError.hidden = true;
    authSubmit.disabled = true;
    const { error } = authTab === 'signup'
      ? await sb.auth.signUp({ email, password })
      : await sb.auth.signInWithPassword({ email, password });
    authSubmit.disabled = false;
    if(error){
      authError.textContent = error.message;
      authError.hidden = false;
      return;
    }
    closeAuth();
    openDashboard();
  });

  async function openDashboard(){
    dashboardOverlay.classList.add('visible');
    dashboardEmail.textContent = '';
    dashboardStatus.textContent = 'Checking subscription…';
    dashboardContent.innerHTML = '';
    await sbReady;
    if(!sb) return;
    const { data:{ session } } = await sb.auth.getSession();
    if(!session){
      dashboardOverlay.classList.remove('visible');
      openAuth();
      return;
    }
    dashboardEmail.textContent = session.user.email;
    try {
      const res = await fetch('/api/subscription-status', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const data = await res.json();
      if(data.active){
        dashboardStatus.innerHTML = '<span class="status-badge status-active">Active subscription</span>';
        dashboardContent.innerHTML = '<p class="dashboard-placeholder">Your video courses will appear here soon. 🎬</p>';
      } else {
        dashboardStatus.innerHTML = '<span class="status-badge status-inactive">No active subscription</span>';
        dashboardContent.innerHTML = '<button class="btn btn-pill btn-primary btn-block" id="dashboardSubscribeBtn" type="button">Subscribe for €19.99/month</button>';
        const subBtn = document.getElementById('dashboardSubscribeBtn');
        subBtn.addEventListener('click', async () => {
          subBtn.disabled = true;
          subBtn.textContent = 'Redirecting to secure payment…';
          try {
            await startCheckout(session.user.email, session.user.id);
          } catch(err){
            alert(err.message);
            subBtn.disabled = false;
            subBtn.textContent = 'Subscribe for €19.99/month';
          }
        });
      }
    } catch(e){
      dashboardStatus.textContent = 'Could not load subscription status.';
    }
  }

  accountButtons.forEach(btn => btn.addEventListener('click', async () => {
    await sbReady;
    if(sb){
      const { data:{ session } } = await sb.auth.getSession();
      if(session){ openDashboard(); return; }
    }
    openAuth();
  }));

  dashboardClose.addEventListener('click', () => dashboardOverlay.classList.remove('visible'));
  dashboardOverlay.addEventListener('click', (e) => { if(e.target === dashboardOverlay) dashboardOverlay.classList.remove('visible'); });

  logoutBtn.addEventListener('click', async () => {
    await sbReady;
    if(sb) await sb.auth.signOut();
    dashboardOverlay.classList.remove('visible');
  });
}

// ============ HASH CLEANUP (avoid re-jumping to a section on reload) ============
function setupHashCleanup(){
  function stripHash(){
    if(location.hash){
      history.replaceState(null, '', location.pathname + location.search);
    }
  }
  stripHash();
  window.addEventListener('hashchange', stripHash);
}

// ============ SIGNUP: CREATE ACCOUNT + START CHECKOUT ============
function setupSignup(){
  const btn = document.getElementById('signupBtn');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('signupPassword');
  if(!btn) return;
  const defaultLabel = btn.textContent;

  function reset(){
    btn.disabled = false;
    btn.textContent = defaultLabel;
  }

  btn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let valid = true;
    if(!email || !emailInput.checkValidity()){
      emailInput.style.borderColor = '#C1587A';
      valid = false;
    } else {
      emailInput.style.borderColor = '';
    }
    if(!password || password.length < 6){
      passwordInput.style.borderColor = '#C1587A';
      valid = false;
    } else {
      passwordInput.style.borderColor = '';
    }
    if(!valid) return;

    await sbReady;
    if(!sb){
      alert('Account service is temporarily unavailable. Please try again shortly.');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Creating your account…';

    let userId;
    const { data:signUpData, error:signUpError } = await sb.auth.signUp({ email, password });
    if(signUpError){
      if(/already registered|already exists/i.test(signUpError.message)){
        const { data:signInData, error:signInError } = await sb.auth.signInWithPassword({ email, password });
        if(signInError){
          reset();
          passwordInput.style.borderColor = '#C1587A';
          alert('An account with this email already exists. Please check your password.');
          return;
        }
        userId = signInData.user.id;
      } else {
        reset();
        alert(signUpError.message);
        return;
      }
    } else {
      userId = signUpData.user.id;
    }

    btn.textContent = 'Redirecting to secure payment…';
    try {
      await startCheckout(email, userId);
    } catch(err){
      alert(err.message);
      reset();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderFAQ();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  setupStickyBar();
  setupTopbarOverHero();
  setupPopup();
  setupAccount();
  setupMobileMenu();
  setupSignup();
  setupHashCleanup();
});
