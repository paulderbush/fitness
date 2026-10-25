// ============ FAQ DATA ============
const FAQ = [
  { q:"What level should I be?", a:"Any level. The program is designed for both beginners and experienced women. Every workout includes adjustable intensity levels, allowing you to train at the pace that's right for you while progressing safely over time." },
  { q:"I'm over 40. Is this program right for me?", a:"Absolutely. Your body can become stronger, leaner, and healthier at any age. The program adapts to your fitness level so you can train safely and continue making progress." },
  { q:"Can I do this program after pregnancy?", a:"Yes, if your doctor has cleared you to exercise. The workouts can be adapted to your current level and gradually increased as your body gets stronger." },
  { q:"What if I have back pain or poor posture?", a:"Strong muscles help support good posture. Along with the main program, you'll have access to posture-focused workouts designed to strengthen your back and core, and improve the way you move." },
  { q:"What if I don't have enough motivation?", a:"You don't need more motivation - you need a system. Our step-by-step program tells you exactly what to do every day, so you never have to guess. Many members notice their first positive changes within the first 10 days, which makes it much easier to stay motivated." },
  { q:"What if I don't have enough time?", a:"Each workout takes just 20 minutes. We recommend training at least four times a week - that's only 1.5 hours per week. You and your body definitely deserve it." },
  { q:"How much weight can I lose?", a:"Weight loss depends on many factors, including your starting point, nutrition, sleep, and consistency. For many people, a gradual loss of around 5% of body weight over time is considered a safe and realistic pace, though individual results vary." },
  { q:"What if I don't get results?", a:"We're confident in our system. If you follow the workouts and nutrition plan as instructed for 30 days and don't see measurable progress, we'll refund your money according to our guarantee policy." },
  { q:"Do I need a gym?", a:"No. Every workout can be completed at home." },
  { q:"Do I need equipment?", a:"Most workouts require no equipment at all. Some optional programs use resistance bands to increase training variety and intensity." },
  { q:"Do I need to follow a strict diet?", a:"No - we don't believe in restrictive diets. Instead, we teach a balanced, sustainable approach to nutrition that supports your health, energy, and long-term body transformation." },
  { q:"Will I get meal plans and recipes?", a:"Yes. Your membership includes personalized nutrition plans and a large collection of healthy, delicious recipes that are easy to prepare and fit into everyday life." },
  { q:"Why should I trust this program?", a:"This isn't a random collection of workouts - it's a complete body transformation system created specifically for women, combining evidence-based training, personalized nutrition, healthy recipes, and progressive programs designed to help you lose weight, tone your body, improve your posture, and build habits that last." },
  { q:"Is this just another workout app?", a:"No - it's a complete transformation platform. Inside your membership you'll find step-by-step workout systems, weight loss programs, posture correction, flat stomach and glute programs, personalized nutrition plans, hundreds of healthy recipes, and new content added regularly. Everything you need is in one place." },
  { q:"Why should I start today instead of waiting?", a:"Because every week you wait is another week without progress. For just €2.99, you can start today, experience the full program, and see whether it's the right fit for you - with virtually no risk, thanks to our 30-Day Results Guarantee." },
  { q:"Can I cancel my subscription anytime?", a:"Yes. There are no long-term contracts or hidden fees. You can cancel directly from your account at any time, and you'll keep full access until the end of your current billing period." },
];

function renderFAQ(){
  const wrap = document.getElementById('faqList');
  const colLeft = document.getElementById('faqColLeft');
  const colRight = document.getElementById('faqColRight');
  colLeft.innerHTML = '';
  colRight.innerHTML = '';
  const mid = Math.ceil(FAQ.length / 2);
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
    (i < mid ? colLeft : colRight).appendChild(el);
  });
  // set initial open height after render
  const first = wrap.querySelector('.faq-item.open .faq-a');
  if(first) first.style.maxHeight = first.scrollHeight + 'px';
}

// ============ VIDEO SHOWCASE (Up Next) ============
function setupVideoShowcase(){
  const frame = document.getElementById('showcaseVideoFrame');
  const items = document.querySelectorAll('.video-upnext-item');
  if(!frame || !items.length) return;
  items.forEach(item => {
    item.addEventListener('click', () => {
      const videoId = item.dataset.video;
      if(!videoId) return;
      items.forEach(i => i.classList.toggle('active', i === item));
      frame.src = `https://kinescope.io/embed/${videoId}`;
    });
  });
}

// ============ CAROUSEL ARROW LOOPING ============
// Wraps prev/next scroll-by clicks so hitting the arrow at either end of the
// viewport loops back to the opposite end instead of stopping.
function setupLoopingArrows(viewport, prevBtn, nextBtn, step){
  const EPS = 4;
  function atStart(){ return viewport.scrollLeft <= EPS; }
  function atEnd(){ return viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - EPS; }
  prevBtn.addEventListener('click', () => {
    if(atStart()) viewport.scrollTo({ left: viewport.scrollWidth - viewport.clientWidth, behavior:'smooth' });
    else viewport.scrollBy({ left: -step(), behavior:'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    if(atEnd()) viewport.scrollTo({ left: 0, behavior:'smooth' });
    else viewport.scrollBy({ left: step(), behavior:'smooth' });
  });
}

// ============ MEMBERSHIP COVERFLOW CAROUSEL ============
function setupCoverFlowCarousel({ viewportId, dotsId, startIndex = 0, onActiveClick }){
  const viewport = document.getElementById(viewportId);
  const track = viewport && viewport.querySelector('.membership-track');
  const cards = viewport ? Array.from(viewport.querySelectorAll('.membership-card')) : [];
  const dots = Array.from(document.querySelectorAll('#' + dotsId + ' .membership-dot'));
  if(!viewport || !track || !cards.length) return;

  const count = cards.length;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = Math.max(0, Math.min(count - 1, startIndex));
  let dragging = false;
  let dragMoved = false;
  let dragStartX = 0;
  let cardWidthPx = 0;

  function isMobile(){ return window.innerWidth < 760; }

  function render(continuousOffset){
    const base = continuousOffset == null ? activeIndex : continuousOffset;
    const angle = isMobile() ? 26 : 48;
    cards.forEach((card, i) => {
      const offset = i - base;
      const abs = Math.abs(offset);
      const sign = offset < 0 ? -1 : (offset > 0 ? 1 : 0);
      let x, z, rotate, scale, opacity;
      if(abs <= 1){
        x = sign * abs * 56;
        z = -abs * 70;
        rotate = -sign * abs * angle;
        scale = 1 - abs * 0.14;
        opacity = 1 - abs * 0.22;
      } else {
        const extra = abs - 1;
        x = sign * (56 + extra * 34);
        z = -70 - extra * 50;
        rotate = -sign * angle;
        scale = Math.max(0.56, 1 - abs * 0.14);
        opacity = Math.max(0, 0.78 - extra * 0.42);
      }
      card.style.transform = `translateX(${x}%) translateZ(${z}px) rotateY(${rotate}deg) scale(${scale})`;
      card.style.opacity = String(opacity);
      card.style.zIndex = String(100 - Math.round(abs * 10));
      card.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
      card.classList.toggle('active', continuousOffset == null && i === activeIndex);
    });
  }

  function updateDots(){
    dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
  }

  function goTo(index){
    activeIndex = Math.max(0, Math.min(count - 1, index));
    render();
    updateDots();
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if(dragMoved) return;
      if(i !== activeIndex) goTo(i);
      else if(onActiveClick) onActiveClick();
    });
  });

  viewport.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowLeft'){ e.preventDefault(); goTo(activeIndex - 1); }
    else if(e.key === 'ArrowRight'){ e.preventDefault(); goTo(activeIndex + 1); }
  });

  let activePointerId = null;
  function onPointerDown(e){
    if(e.button !== undefined && e.button !== 0) return;
    dragging = true;
    dragMoved = false;
    dragStartX = e.clientX;
    activePointerId = e.pointerId;
    cardWidthPx = cards[0].getBoundingClientRect().width || 1;
  }
  function onPointerMove(e){
    if(!dragging) return;
    const dx = e.clientX - dragStartX;
    if(!dragMoved && Math.abs(dx) > 4){
      dragMoved = true;
      viewport.classList.add('dragging');
      // Only capture once a real drag is detected, so a plain click on a
      // card still hit-tests normally instead of resolving to the viewport.
      if(viewport.setPointerCapture){
        try { viewport.setPointerCapture(activePointerId); } catch(err){ /* ignore */ }
      }
    }
    if(dragMoved){
      if(e.cancelable) e.preventDefault();
      const frac = dx / (cardWidthPx * 0.9);
      render(activeIndex - frac);
    }
  }
  function endDrag(e){
    if(!dragging) return;
    dragging = false;
    viewport.classList.remove('dragging');
    if(!dragMoved) return;
    const dx = (typeof e.clientX === 'number' ? e.clientX : dragStartX) - dragStartX;
    const frac = dx / (cardWidthPx * 0.9);
    let delta = Math.round(-frac);
    if(delta === 0 && Math.abs(frac) > 0.15) delta = frac > 0 ? -1 : 1;
    goTo(activeIndex + delta);
  }

  viewport.addEventListener('pointerdown', onPointerDown);
  viewport.addEventListener('pointermove', onPointerMove);
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('pointerleave', (e) => { if(dragging) endDrag(e); });

  // trackpad horizontal swipe
  let wheelCooldown = false;
  viewport.addEventListener('wheel', (e) => {
    if(Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    if(wheelCooldown) return;
    if(Math.abs(e.deltaX) < 12) return;
    wheelCooldown = true;
    goTo(activeIndex + (e.deltaX > 0 ? 1 : -1));
    setTimeout(() => { wheelCooldown = false; }, 420);
  }, { passive:false });

  if(reducedMotion){
    cards.forEach(c => { c.style.transitionDuration = '0.01s'; });
  }

  render();
  updateDots();
  window.addEventListener('resize', () => render());
}

function setupMembershipCarousel(){
  setupCoverFlowCarousel({ viewportId:'membershipViewport', dotsId:'membershipDots' });
}

function setupPricingCarousel(){
  setupCoverFlowCarousel({
    viewportId:'pricingViewport',
    dotsId:'pricingDots',
    startIndex:1,
    onActiveClick: () => {
      const signup = document.getElementById('signup');
      if(signup) signup.scrollIntoView({ behavior:'smooth' });
    }
  });
}

// ============ RESULTS CAROUSEL ============
function setupResultsCarousel(){
  const viewport = document.getElementById('resultsViewport');
  const prevBtn = document.querySelector('.results-arrow-prev');
  const nextBtn = document.querySelector('.results-arrow-next');
  const dots = Array.from(document.querySelectorAll('#resultsDots .results-dot'));
  const card = viewport && viewport.querySelector('.results-card');
  if(!viewport || !prevBtn || !nextBtn || !card) return;

  function step(){ return card.getBoundingClientRect().width; }
  setupLoopingArrows(viewport, prevBtn, nextBtn, step);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => viewport.scrollTo({ left: step() * i, behavior:'smooth' }));
  });

  if(dots.length){
    let ticking = false;
    viewport.addEventListener('scroll', () => {
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const index = Math.round(viewport.scrollLeft / step());
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
        ticking = false;
      });
    }, { passive:true });
  }
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

// ============ POPUP OVERLAY HELPERS ============
// Overlays default to display:none so forms inside them (e.g. the account
// login/signup fields) aren't part of the page at load - some browsers will
// otherwise proactively offer to autofill a saved password for a form that
// merely exists in the DOM, even while it's only hidden via opacity.
function showOverlay(el){
  el.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
}
function hideOverlay(el){
  el.classList.remove('visible');
  const onEnd = (e) => {
    if(e.target !== el) return;
    el.style.display = 'none';
    el.removeEventListener('transitionend', onEnd);
  };
  el.addEventListener('transitionend', onEnd);
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
      showOverlay(overlay);
      sessionStorage.setItem('bm_popup_shown', '1');
    }, 5000);
  }

  function hide(){ hideOverlay(overlay); }
  closeBtn.addEventListener('click', hide);
  overlay.addEventListener('click', (e) => { if(e.target === overlay) hide(); });
  cta.addEventListener('click', hide);
}

// ============ ACCOUNT: AUTH POPUP ============
// Signed-out users get the login/signup popup; signed-in users are sent
// straight to the account page instead (see account.html / account.js).
function setupAccount(){
  const authOverlay = document.getElementById('accountPopupOverlay');
  const authClose = document.getElementById('accountPopupClose');
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForm = document.getElementById('authForm');
  const authEmail = document.getElementById('authEmail');
  const authPassword = document.getElementById('authPassword');
  const authSubmit = document.getElementById('authSubmit');
  const authError = document.getElementById('authError');
  const authSuccess = document.getElementById('authSuccess');

  const accountButtons = [document.getElementById('accountBtn'), document.getElementById('accountBtnMobile')].filter(Boolean);
  if(!authOverlay || accountButtons.length === 0) return;

  let authTab = 'login';

  function setAuthTab(tab){
    authTab = tab;
    authTabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    authSubmit.textContent = tab === 'signup' ? 'Sign Up' : 'Log In';
    authPassword.autocomplete = tab === 'signup' ? 'new-password' : 'current-password';
    authError.hidden = true;
    authSuccess.hidden = true;
    authForm.hidden = false;
  }
  authTabs.forEach(t => t.addEventListener('click', () => setAuthTab(t.dataset.tab)));

  function openAuth(){
    setAuthTab('login');
    authForm.reset();
    showOverlay(authOverlay);
  }
  function closeAuth(){ hideOverlay(authOverlay); }
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
    const { data, error } = authTab === 'signup'
      ? await sb.auth.signUp({ email, password })
      : await sb.auth.signInWithPassword({ email, password });
    authSubmit.disabled = false;
    if(error){
      authError.textContent = error.message;
      authError.hidden = false;
      return;
    }
    if(authTab === 'signup' && !data.session){
      // Email confirmation is required - the account exists but there's
      // no active session yet, so show a success message instead of
      // silently reopening the (now pointless) login form.
      authForm.hidden = true;
      authSuccess.hidden = false;
      return;
    }
    window.location.href = 'account.html';
  });

  accountButtons.forEach(btn => btn.addEventListener('click', async () => {
    await sbReady;
    if(sb){
      const { data:{ session } } = await sb.auth.getSession();
      if(session){ window.location.href = 'account.html'; return; }
    }
    openAuth();
  }));
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

    const planInput = document.querySelector('input[name="signupPlan"]:checked');
    const plan = planInput ? planInput.value : 'trial';

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
      await startCheckout(email, userId, plan);
    } catch(err){
      alert(err.message);
      reset();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderFAQ();
  setupVideoShowcase();
  setupMembershipCarousel();
  setupPricingCarousel();
  setupResultsCarousel();
  setupTopbarOverHero();
  setupPopup();
  setupAccount();
  setupSignup();
  setupHashCleanup();
});
