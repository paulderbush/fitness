// ============ MOBILE FULL-SCREEN MENU ============
// Shared by index.html, account.html and program.html.
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

document.addEventListener('DOMContentLoaded', setupMobileMenu);
