// ============ I18N ENGINE (EN / RU) ============
// Shared by index.html, account.html and program.html. Loaded before
// nav.js/script.js/account.js so BM_I18N helpers are available to them.
const BM_LANG_KEY = 'bm_lang';
const BM_LANG_DEFAULT = 'en';

// Keys below map to either plain text (bound via data-i18n, which sets
// textContent) or markup containing <br>/<span>/<strong> (bound via
// data-i18n-html, which sets innerHTML). Dynamic strings used from script.js
// /account.js are read with bmT() directly.
const TRANSLATIONS = {
  en: {
    'nav.membership': 'Membership',
    'nav.workouts': 'Workouts',
    'nav.coach': 'Coach',
    'nav.reviews': 'Reviews',
    'nav.subscription': 'Subscription',
    'nav.faq': 'FAQ',
    'nav.account': 'My Account',
    'nav.join': 'Join Now',
    'nav.programs': 'Programs',
    'nav.nutrition': 'Nutrition',
    'nav.pricing': 'Pricing',
    'nav.back_to_site': 'Back to site',

    'hero_title': 'See Real Results<br>in <span class="hero-accent">10 Days.</span>',
    'hero.lead': '20-Min Workouts • Nutrition Plans<br>500+ Recipes • Online Coach Support',
    'cta.main': 'Full Access for 10 Days • €2.99',
    'hero.feature1': '20-Minute<br>Workouts',
    'hero.feature2': 'Nutrition<br>Plans',
    'hero.feature3': 'Track<br>Progress',
    'hero.feature4': 'Expert<br>Support',
    'hero.stat_label': 'From 500+ reviews',
    'hero.scroll': 'Scroll to explore',
    'hero.footnote': 'More than a workout - a better you',

    'membership.eyebrow': 'Membership',
    'membership.heading': 'Your Complete<br class="membership-title-break"><span class="showcase-accent">Weight-Loss Toolkit.</span>',
    'membership.lead': 'Training, nutrition, progress tracking, mindset & online coach support - all in one place.',
    'membership.footnote': 'Stronger | Happier | You',

    'video.eyebrow': 'See it in action',
    'video.heading': 'Your Workout.<br><span class="showcase-accent">Step by Step.</span>',
    'video.lead': 'Follow every exercise with guided video, timing, technique cues and target muscles.',
    'video.nav1': 'Workout Video',
    'video.nav2': 'Timer & Guidance',
    'video.nav3': 'Technique Tips',
    'video.nav4': 'Target Muscles',
    'video.nav5': 'Modifications<br>(for all levels)',
    'video.feat1': '20-30 Min<br>Effective Workouts',
    'video.feat2': 'Guided Technique<br>On Screen',
    'video.feat3': 'Target Muscles<br>In Every Video',
    'video.feat4': 'For All Levels<br>Beginner To Advanced',
    'video.upnext_label': 'Up Next',
    'video.workout1': 'Workout 01',
    'video.workout2': 'Workout 02',
    'video.workout3': 'Workout 03',

    'coach.eyebrow': 'Meet your coach',
    'coach.heading': 'I Took My Body to the Stage to Test What <span class="showcase-accent">Really Works.</span>',
    'coach.bio1': "I'm Maria - fitness coach, French Fitness Bikini Champion, and European Fitness Bikini Bronze Medalist.",
    'coach.bio2': 'Competing taught me what it really takes to change a body. I turned that experience into Body Muse - science-based training and nutrition for real women with real, busy lives.',
    'coach.cred1': '15+ Years<br>In Fitness & Nutrition',
    'coach.cred2': 'French Fitness Bikini<br>Champion',
    'coach.cred3': 'European<br>Bronze Medalist',
    'coach.quote': "I learned what it takes to transform a body.<br>Now I've built a system that fits into real life",

    'results.badge': 'REAL WOMEN • REAL RESULTS • ',
    'results.eyebrow': 'The Results Speak For Themselves',
    'results.heading': 'They Did It. <span class="showcase-accent">You Can Too.</span>',
    'results.lead': 'Incredible transformations from women who followed the Body Muse system.',
    'results.stories_eyebrow': 'Real Women. Real Stories.',
    'results.testimonial1': '"I\'ve tried so many programs, but this is the first one that actually fits my life. The workouts are fun, the recipes are amazing, and I see real results!"',
    'results.testimonial2': '"Not just a physical transformation - I feel happier, more energetic and like the best version of myself. Thank you, Body Muse!"',
    'results.testimonial3': '"Simple, effective and realistic. I lost 7 kg, my posture improved and I finally feel good in my own skin. Highly recommend!"',
    'results.stat1_label': 'Women Transformed',
    'results.stat2_label': 'Average Rating',
    'results.stat3_val': 'Real Results',
    'results.stat3_label': 'Not Fads',
    'results.stat4_val': 'A Stronger,<br>Happier You',
    'results.stat4_label': 'For Life',
    'results.banner_caption': 'Discipline<br>Creates<br>Freedom',
    'results.banner_eyebrow': 'This Is What Body Muse',
    'results.banner_heading': 'Can Do for <span class="showcase-accent">You.</span>',
    'results.banner_feat1': 'Stronger<br>Body',
    'results.banner_feat2': 'Healthier<br>Habits',
    'results.banner_feat3': 'More<br>Confidence',
    'results.banner_feat4': 'A Happier<br>You',

    'pricing.eyebrow': 'Plans',
    'pricing.heading': 'Choose your plan,<br><span class="showcase-accent">Start Today.</span>',

    'faq.eyebrow': 'Questions',
    'faq.heading': 'Frequently asked <span class="showcase-accent">questions</span>',

    'signup.eyebrow': 'Get started',
    'signup.heading': "Don't wait, let's start <span class=\"showcase-accent\">right now.</span>",
    'signup.email_label': 'Your email',
    'signup.field_hint': "We'll create your account automatically - you'll choose a password right after checkout.",
    'signup.info_label': 'Important information',
    'signup.info_text': 'Just <strong>€2.99</strong> for your first 10 days, then <strong>€19.99/month</strong> - cancel anytime. Want to save more? Switch to a 6-month or annual plan whenever you like, right from your account.<br><br>Instant access. Cancel anytime. Covered by our 30-Day Results Guarantee.',
    'signup.payment_note': '\u{1F4B3} Payment is collected securely on the next step',

    'footer.tagline': 'Strong. Beautiful. Confident.',
    'footer.fine': '© Body Muse. All rights reserved.',

    'popup.eyebrow': "Don't wait",
    'popup.title': 'Start your transformation and see results in 10 days',
    'popup.cta': 'Start My 10-Day Trial for €2.99',

    'auth.login_tab': 'Log In',
    'auth.signup_tab': 'Sign Up',
    'auth.success1': '✅ You successfully made an account.',
    'auth.success2': 'Check your email to confirm your registration, then log in.',
    'auth.email_label': 'Email address',
    'auth.password_label': 'Password',
    'auth.service_unavailable': 'Account service is temporarily unavailable. Please try again shortly.',
    'auth.email_taken': 'This email already has an account. If you started signing up before, please continue on the same device and browser you used then.',

    'signup.creating': 'Creating your account…',
    'signup.redirecting': 'Redirecting to secure payment…',

    'acct.checking': 'Checking subscription…',
    'acct.active_badge': 'Active subscription',
    'acct.inactive_badge': 'No active subscription',
    'acct.cancel_scheduled': "Your subscription is set to cancel and will stay active until <b>{date}</b> ({left} {dayWord} left). You won't be charged again.",
    'acct.renews': 'Renews in <b>{left} {dayWord}</b> (on {date}).',
    'acct.cancel_btn': 'Cancel subscription',
    'acct.cancelling': 'Cancelling…',
    'acct.subscribe_btn': 'Subscribe for €19.99/month',
    'acct.confirm_cancel': "Cancel your subscription? You'll keep access until {date}.",
    'acct.cancel_error': 'Could not cancel subscription.',
    'acct.load_error': 'Could not load subscription status.',
    'acct.hi': 'Hi, {name} ({email})',
    'acct.join_now': 'Join Now',
    'acct.start_training': 'Start Training',
    'acct.day_1': 'day',
    'acct.day_other': 'days',

    'acct.eyebrow': 'My Account',
    'acct.heading': 'Your membership',
    'acct.payment_received': 'Payment received',
    'acct.onboarding_title': 'Finish setting up your account',
    'acct.onboarding_hint': 'One last step - choose a password so you can log in anytime to manage your subscription.',
    'acct.name_label': 'Your name (optional)',
    'acct.password_label': 'Create a password',
    'acct.password_placeholder': 'At least 6 characters',
    'acct.save_continue': 'Save and continue',
    'acct.saving': 'Saving…',
    'acct.program_name': 'Body Muse Program',
    'acct.logout': 'Log out',

    'prog.checking': 'Checking access…',
    'prog.eyebrow': 'Your Program',
    'prog.placeholder': 'Your video courses will appear here soon. \u{1F3AC}',

    'lang.modal_q1': 'Choose your language',
    'lang.modal_q2': 'Выберите язык',
  },
  ru: {
    'nav.membership': 'Членство',
    'nav.workouts': 'Тренировки',
    'nav.coach': 'Тренер',
    'nav.reviews': 'Отзывы',
    'nav.subscription': 'Тарифы',
    'nav.faq': 'FAQ',
    'nav.account': 'Личный кабинет',
    'nav.join': 'Присоединиться',
    'nav.programs': 'Программы',
    'nav.nutrition': 'Питание',
    'nav.pricing': 'Тарифы',
    'nav.back_to_site': 'Назад на сайт',

    'hero_title': 'Твой<br class="hero-ru-break"> результат<br><span class="hero-accent">за 10 дней</span>',
    'hero.lead': 'Тренировки по 20 минут • Планы питания<br>500+ рецептов • Поддержка онлайн-тренера',
    'cta.main': 'Полный доступ на 10 дней • €2.99',
    'hero.feature1': 'Тренировки<br>по 20 минут',
    'hero.feature2': 'Планы<br>питания',
    'hero.feature3': 'Отслеживание<br>прогресса',
    'hero.feature4': 'Поддержка<br>эксперта',
    'hero.stat_label': 'По 500+ отзывам',
    'hero.scroll': 'Листайте вниз',
    'hero.footnote': 'Больше, чем тренировка - лучшая версия тебя',

    'membership.eyebrow': 'Членство',
    'membership.heading': 'Твой полный<br class="membership-title-break"><span class="showcase-accent">набор для похудения.</span>',
    'membership.lead': 'Тренировки, питание, отслеживание прогресса, настрой и поддержка онлайн-тренера - всё в одном месте.',
    'membership.footnote': 'Сильнее | Счастливее | Ты',

    'video.eyebrow': 'Смотри в деле',
    'video.heading': 'Твоя тренировка.<br><span class="showcase-accent">Шаг за шагом.</span>',
    'video.lead': 'Выполняй каждое упражнение с видео-инструкцией, таймером, подсказками по технике и целевыми мышцами.',
    'video.nav1': 'Видео тренировки',
    'video.nav2': 'Таймер и подсказки',
    'video.nav3': 'Советы по технике',
    'video.nav4': 'Целевые мышцы',
    'video.nav5': 'Модификации<br>(для любого уровня)',
    'video.feat1': '20-30 минут<br>эффективных тренировок',
    'video.feat2': 'Техника<br>на экране',
    'video.feat3': 'Целевые мышцы<br>в каждом видео',
    'video.feat4': 'Для всех уровней<br>от новичка до профи',
    'video.upnext_label': 'Далее',
    'video.workout1': 'Тренировка 01',
    'video.workout2': 'Тренировка 02',
    'video.workout3': 'Тренировка 03',

    'coach.eyebrow': 'Знакомьтесь с тренером',
    'coach.heading': 'Я вышла на сцену, чтобы проверить, что <span class="showcase-accent">действительно работает.</span>',
    'coach.bio1': 'Я Мария - фитнес-тренер, чемпионка Франции по фитнес-бикини и бронзовый призёр чемпионата Европы.',
    'coach.bio2': 'Соревнования научили меня, что действительно нужно, чтобы изменить тело. Я превратила этот опыт в Body Muse - тренировки и питание на основе науки для реальных женщин с реальной занятой жизнью.',
    'coach.cred1': '15+ лет<br>в фитнесе и питании',
    'coach.cred2': 'Чемпионка Франции<br>по фитнес-бикини',
    'coach.cred3': 'Бронзовый призёр<br>чемпионата Европы',
    'coach.quote': 'Я узнала, что нужно, чтобы изменить тело.<br>Теперь я создала систему, которая вписывается в реальную жизнь',

    'results.badge': 'РЕАЛЬНЫЕ ЖЕНЩИНЫ • РЕАЛЬНЫЕ РЕЗУЛЬТАТЫ • ',
    'results.eyebrow': 'Результаты говорят сами за себя',
    'results.heading': 'У них получилось. <span class="showcase-accent">Получится и у тебя.</span>',
    'results.lead': 'Невероятные преображения женщин, которые следовали системе Body Muse.',
    'results.stories_eyebrow': 'Реальные женщины. Реальные истории.',
    'results.testimonial1': '«Я перепробовала столько программ, но это первая, которая реально вписалась в мою жизнь. Тренировки в радость, рецепты потрясающие, и результат виден на самом деле!»',
    'results.testimonial2': '«Это не просто физическое преображение - я стала счастливее, энергичнее и чувствую себя лучшей версией себя. Спасибо, Body Muse!»',
    'results.testimonial3': '«Просто, эффективно и реалистично. Я похудела на 7 кг, улучшилась осанка, и я наконец-то чувствую себя комфортно в своём теле. Очень рекомендую!»',
    'results.stat1_label': 'Женщин преобразились',
    'results.stat2_label': 'Средний рейтинг',
    'results.stat3_val': 'Реальные результаты',
    'results.stat3_label': 'Без диет-фокусов',
    'results.stat4_val': 'Сильнее,<br>счастливее',
    'results.stat4_label': 'Навсегда',
    'results.banner_caption': 'Дисциплина<br>создаёт<br>свободу',
    'results.banner_eyebrow': 'Вот что Body Muse',
    'results.banner_heading': 'может сделать <span class="showcase-accent">для тебя.</span>',
    'results.banner_feat1': 'Сильнее<br>тело',
    'results.banner_feat2': 'Здоровые<br>привычки',
    'results.banner_feat3': 'Больше<br>уверенности',
    'results.banner_feat4': 'Счастливее<br>ты',

    'pricing.eyebrow': 'Тарифы',
    'pricing.heading': 'Выбери тариф<br><span class="showcase-accent">и начни сегодня.</span>',

    'faq.eyebrow': 'Вопросы',
    'faq.heading': 'Часто задаваемые <span class="showcase-accent">вопросы</span>',

    'signup.eyebrow': 'Начни сейчас',
    'signup.heading': 'Не жди, начнём <span class="showcase-accent">прямо сейчас.</span>',
    'signup.email_label': 'Твой email',
    'signup.field_hint': 'Мы автоматически создадим аккаунт - пароль ты придумаешь сразу после оплаты.',
    'signup.info_label': 'Важная информация',
    'signup.info_text': 'Всего <strong>€2.99</strong> за первые 10 дней, затем <strong>€19.99/месяц</strong> - отмена в любой момент. Хочешь экономить больше? Переключись на 6-месячный или годовой тариф в любой момент прямо в личном кабинете.<br><br>Мгновенный доступ. Отмена в любой момент. Действует гарантия результата 30 дней.',
    'signup.payment_note': '\u{1F4B3} Оплата проходит безопасно на следующем шаге',

    'footer.tagline': 'Сильная. Красивая. Уверенная.',
    'footer.fine': '© Body Muse. Все права защищены.',

    'popup.eyebrow': 'Не жди',
    'popup.title': 'Начни преображение и увидь результат через 10 дней',
    'popup.cta': 'Начать 10-дневный период за €2.99',

    'auth.login_tab': 'Войти',
    'auth.signup_tab': 'Регистрация',
    'auth.success1': '✅ Аккаунт успешно создан.',
    'auth.success2': 'Проверь почту, подтверди регистрацию и затем войди.',
    'auth.email_label': 'Email адрес',
    'auth.password_label': 'Пароль',
    'auth.service_unavailable': 'Сервис аккаунтов временно недоступен. Попробуйте немного позже.',
    'auth.email_taken': 'У этого email уже есть аккаунт. Если вы уже начинали регистрацию раньше, продолжите на том же устройстве и в том же браузере.',

    'signup.creating': 'Создаём аккаунт…',
    'signup.redirecting': 'Перенаправляем на безопасную оплату…',

    'acct.checking': 'Проверяем подписку…',
    'acct.active_badge': 'Активная подписка',
    'acct.inactive_badge': 'Нет активной подписки',
    'acct.cancel_scheduled': 'Подписка будет отменена, но останется активной до <b>{date}</b> ({left} {dayWord}). Списание больше не повторится.',
    'acct.renews': 'Продление через <b>{left} {dayWord}</b> ({date}).',
    'acct.cancel_btn': 'Отменить подписку',
    'acct.cancelling': 'Отменяем…',
    'acct.subscribe_btn': 'Оформить подписку за €19.99/мес',
    'acct.confirm_cancel': 'Отменить подписку? Доступ сохранится до {date}.',
    'acct.cancel_error': 'Не удалось отменить подписку.',
    'acct.load_error': 'Не удалось загрузить статус подписки.',
    'acct.hi': 'Привет, {name} ({email})',
    'acct.join_now': 'Присоединиться',
    'acct.start_training': 'Начать тренировки',
    'acct.day_1': 'день',
    'acct.day_few': 'дня',
    'acct.day_other': 'дней',

    'acct.eyebrow': 'Личный кабинет',
    'acct.heading': 'Твоя подписка',
    'acct.payment_received': 'Оплата получена',
    'acct.onboarding_title': 'Завершите настройку аккаунта',
    'acct.onboarding_hint': 'Остался последний шаг - придумайте пароль, чтобы входить и управлять подпиской в любое время.',
    'acct.name_label': 'Ваше имя (необязательно)',
    'acct.password_label': 'Придумайте пароль',
    'acct.password_placeholder': 'Минимум 6 символов',
    'acct.save_continue': 'Сохранить и продолжить',
    'acct.saving': 'Сохраняем…',
    'acct.program_name': 'Программа Body Muse',
    'acct.logout': 'Выйти',

    'prog.checking': 'Проверка доступа…',
    'prog.eyebrow': 'Твоя программа',
    'prog.placeholder': 'Видео-курсы скоро появятся здесь. \u{1F3AC}',

    'lang.modal_q1': 'Choose your language',
    'lang.modal_q2': 'Выберите язык',
  },
};

// ============ OVERLAY HELPERS (shared with script.js) ============
// Overlays default to display:none so forms inside them aren't part of the
// page at load - some browsers will otherwise proactively offer to autofill
// a saved password for a form that merely exists in the DOM.
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

function bmGetLang(){
  const stored = localStorage.getItem(BM_LANG_KEY);
  return stored === 'ru' || stored === 'en' ? stored : null;
}
function bmHasChosenLang(){
  return bmGetLang() !== null;
}
function bmCurrentLang(){
  return bmGetLang() || BM_LANG_DEFAULT;
}
function bmSetLang(lang){
  localStorage.setItem(BM_LANG_KEY, lang);
}

function bmT(key, vars){
  const lang = bmCurrentLang();
  let str = (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (TRANSLATIONS.en && TRANSLATIONS.en[key]) || key;
  if(vars){
    str = str.replace(/\{(\w+)\}/g, (m, p1) => (p1 in vars ? vars[p1] : m));
  }
  return str;
}

function bmApplyTranslations(){
  const lang = bmCurrentLang();
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = bmT(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = bmT(el.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = bmT(el.getAttribute('data-i18n-placeholder'));
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    el.setAttribute('aria-label', bmT(el.getAttribute('data-i18n-aria-label')));
  });

  document.querySelectorAll('[data-src-ru]').forEach(el => {
    if(!el.dataset.srcEn) el.dataset.srcEn = el.getAttribute('src');
    el.setAttribute('src', lang === 'ru' ? el.dataset.srcRu : el.dataset.srcEn);
  });

  document.querySelectorAll('[data-lang-switch]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang-switch') === lang);
  });

  document.dispatchEvent(new CustomEvent('bm:langchange', { detail: { lang } }));
}

function bmChooseLang(lang){
  bmSetLang(lang);
  const modal = document.getElementById('langModalOverlay');
  if(modal) hideOverlay(modal);
  bmApplyTranslations();
}

function bmSetupLanguage(){
  document.querySelectorAll('[data-lang-switch]').forEach(btn => {
    btn.addEventListener('click', () => bmChooseLang(btn.getAttribute('data-lang-switch')));
  });

  const modal = document.getElementById('langModalOverlay');
  if(!bmHasChosenLang() && modal){
    modal.querySelectorAll('[data-lang-choice]').forEach(btn => {
      btn.addEventListener('click', () => bmChooseLang(btn.getAttribute('data-lang-choice')));
    });
    showOverlay(modal);
  } else if(modal){
    modal.remove();
  }

  bmApplyTranslations();
}

document.addEventListener('DOMContentLoaded', bmSetupLanguage);
