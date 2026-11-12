// Small progressive enhancements. Everything works without this file.
(() => {
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // mobile menu: panel over the page; ☰ becomes ✕; Escape, link taps and widening the window all close it
  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('.menu-btn');
  if (menuBtn && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      document.documentElement.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    document.querySelectorAll('.mobile-menu a').forEach(a => a.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); menuBtn.focus(); } });
    matchMedia('(min-width: 981px)').addEventListener('change', e => e.matches && setOpen(false));
  }

  // floating "Let's talk" on phones: show after the hero, hide once the contact section is visible
  const float = document.querySelector('.float-cta');
  const hero = document.querySelector('.hero, .roots-hero');
  const contact = document.getElementById('contact');
  if (float && hero && 'IntersectionObserver' in window) {
    let pastHero = false, atContact = false;
    const sync = () => float.classList.toggle('is-visible', pastHero && !atContact);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; sync(); }).observe(hero);
    // hide it from the contact section to the end of the page (it would cover the form and footer)
    if (contact) new IntersectionObserver(([e]) => { atContact = e.isIntersecting || e.boundingClientRect.top < 0; sync(); }).observe(contact);
  }

  // contact form: submit in place (Netlify Forms), keep the visitor on the page
  const box = document.getElementById('lead');
  const form = box && box.querySelector('form');
  if (form) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const err = form.querySelector('[data-form-error]');
      btn.disabled = true;
      btn.firstChild.textContent = 'Sending… ';
      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(new FormData(form)).toString(),
        });
        if (!res.ok) throw new Error(res.status);
        box.classList.add('is-sent');
        box.querySelector('.form-status').focus?.();
      } catch {
        err.hidden = false;
        btn.disabled = false;
        btn.firstChild.textContent = 'Try sending again ';
      }
    });
  }

  const y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
