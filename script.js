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
  const closeBtn = document.getElementById('mobileMenuClose');
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
  closeBtn.addEventListener('click', close);
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

// ============ ACCOUNT POPUP (My Account — coming soon) ============
function setupAccountPopup(){
  const btn = document.getElementById('accountBtn');
  const overlay = document.getElementById('accountPopupOverlay');
  const closeBtn = document.getElementById('accountPopupClose');
  if(!btn || !overlay) return;

  function show(){ overlay.classList.add('visible'); }
  function hide(){ overlay.classList.remove('visible'); }

  btn.addEventListener('click', show);
  closeBtn.addEventListener('click', hide);
  overlay.addEventListener('click', (e) => { if(e.target === overlay) hide(); });
}

// ============ SIGNUP BUTTON (placeholder — wire to Stripe Checkout later) ============
function setupSignup(){
  const btn = document.getElementById('signupBtn');
  const emailInput = document.getElementById('emailInput');
  if(!btn) return;
  btn.addEventListener('click', () => {
    if(!emailInput.value || !emailInput.checkValidity()){
      emailInput.focus();
      emailInput.style.borderColor = '#C1587A';
      return;
    }
    // TODO: replace with real Stripe Checkout redirect
    btn.textContent = 'Redirecting to secure payment…';
    btn.style.opacity = '0.7';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderFAQ();
  updateCountdown();
  setInterval(updateCountdown, 1000);
  setupStickyBar();
  setupPopup();
  setupAccountPopup();
  setupMobileMenu();
  setupSignup();
});
