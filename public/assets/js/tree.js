// Tree mode: fruit hang from real points on the SVG branches; pluck one to read it.
(() => {
  const stage = document.getElementById('stage');
  if (!stage) return;
  const svg = stage.querySelector('svg');
  const layout = document.getElementById('tree');
  const panel = document.getElementById('panel');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GROUND = 884; // y of the soil line in SVG units
  // On phones, crop the drawing to the canopy + soil so everything is ~25% bigger.
  const narrow = matchMedia('(max-width: 600px)');
  let VB = [0, 0, 1000, 1000];

  const CONTACT = './#contact';
  const items = [
    {
      id: 'flexisaf', kind: 'role', branch: 'b2', t: 0.62, len: 60, size: 74,
      label: 'Flexisaf · now',
      title: 'Associate Full-Stack Engineer', org: 'Flexisaf Edusoft Limited', when: 'Jan 2025 – Present',
      summary: 'The platform behind 100K+ students and 300+ tenants. I keep it fast, keep it up, and make it easier to change.',
      points: [
        'Cut average API response time 43% (959.5ms → 545ms) by reworking Java database queries and backend logic.',
        'Led a zero-downtime Docker and platform upgrade on AWS Elastic Beanstalk; scripted the cutover of 300+ DNS records with Python/boto3 around TTL expiry and connection draining.',
        'Traced a recurring ECS memory incident to two causes (an OpenTelemetry integration and a long-running report job) and coordinated the fix.',
        'Spotted that a shared CloudFront setup was caching endpoints by default, and added explicit cache-control headers so those APIs return fresh data.',
        'Designed a batch pipeline for 2,000+ concurrent payment uploads with no memory overflows.',
        'Built an annotation-driven change-logging framework: 40 lines down to 1 per component.',
        'Architected a partner API layer with multi-tenant API keys, rate limiting and annotation-based auth.',
        'Mentored 6 junior engineers on TDD and ran internal sessions on AWS and AI-assisted development.',
      ],
      tags: ['Java', 'Spring Boot', 'AWS ECS', 'Elastic Beanstalk', 'CloudFront', 'PostgreSQL', 'Python'],
      links: [],
    },
    {
      id: 'lellall', kind: 'role', branch: 'b1', t: 0.45, len: 50, size: 68,
      label: 'Lellall',
      title: 'Backend Developer', org: 'Lellall Technologies Ltd', when: 'Sep 2023 – Jan 2025',
      summary: 'Backend for a grocery e-commerce platform that delivered from local markets.',
      points: [
        'Owned backend features end to end, designing the Java services behind local market deliveries.',
        'Built sign-in with OAuth 2.0 and OpenID Connect (including Sign in with Apple) plus encrypted email/password, which improved onboarding conversion and retention.',
        'Watched DigitalOcean Droplet logs to catch and fix production issues before they grew.',
      ],
      tags: ['Java', 'OAuth 2.0', 'OpenID Connect', 'DigitalOcean'],
      links: [],
    },
    {
      id: 'intern', kind: 'role', branch: 'b3', t: 0.8, len: 40, size: 60,
      label: 'Intern · 2022',
      title: 'Intern Backend Developer', org: 'Flexisaf Edusoft Limited', when: 'Oct 2022 – Aug 2023',
      summary: 'Where it started: shipping production Java alongside senior engineers.',
      points: [
        'Designed and built scalable backend components for institutional clients with the senior team.',
        'Switched between Spring Boot, Quarkus and GWT to ship high-priority features for education management systems.',
      ],
      tags: ['Spring Boot', 'Quarkus', 'GWT'],
      links: [],
    },
    {
      id: 'aiagent', kind: 'project', branch: 'b4', t: 0.7, len: 40, size: 58,
      label: 'AI Agent',
      title: 'AI Agent', org: 'Open-source Java library', when: 'Side project',
      summary: 'A reusable Java library that lets AI systems call chosen methods inside your project.',
      points: ['Clean abstraction layer between the model and your code.', 'Maven-based dependency injection so it drops into existing projects.'],
      tags: ['Java', 'Maven', 'LLM tooling'],
      links: [['Read the code on GitHub', 'https://github.com/Lekan128/AiAgent']],
    },
    {
      id: 'stockup', kind: 'project', branch: 't1', t: 0.97, len: 36, mLen: 66, size: 56,
      label: 'StockUp',
      title: 'StockUp', org: 'AI-powered inventory manager', when: 'Side project',
      summary: 'Inventory management with an AI assist, fully deployed on AWS.',
      points: ['React + TypeScript front end, Spring Boot API.', 'Runs on EC2 inside a VPC with RDS, S3 and Route 53, behind Nginx.', 'Application-level caching to keep it quick.'],
      tags: ['React', 'TypeScript', 'Spring Boot', 'AWS', 'Nginx'],
      links: [['Read the code on GitHub', 'https://github.com/Lekan128/stock-up-api']],
    },
    {
      id: 'digital', kind: 'project', branch: 't2', t: 0.97, len: 36, size: 54,
      label: 'Digital Alertness',
      title: 'Digital Alertness', org: 'Android wellness app', when: 'Side project',
      summary: 'A gentle nudge after you’ve been scrolling social media for too long.',
      points: ['Tracks continuous social media use and alerts you after extended sessions.'],
      tags: ['Kotlin', 'Android'],
      links: [['Read the code on GitHub', 'https://github.com/Lekan128/Digital-Wellness']],
    },
    {
      id: 'aws', kind: 'cert', branch: 'b5', t: 0.93, len: 22, size: 52,
      label: 'AWS',
      title: 'AWS Certified Solutions Architect – Associate', org: 'Amazon Web Services', when: 'Certification',
      summary: 'Designing secure, resilient and cost-aware systems on AWS. I use it daily on ECS, Elastic Beanstalk, RDS, S3 and CloudFront.',
      points: [], tags: ['EC2', 'ECS', 'S3', 'Lambda', 'RDS', 'VPC', 'SQS', 'CloudFront'],
      links: [['Verify on Credly', 'https://www.credly.com/badges/2bd7260d-1446-4e87-a885-1500d7deb14e/public_url']],
    },
    {
      id: 'azure', kind: 'cert', branch: 't4', t: 0.97, len: 22, size: 50,
      label: 'Azure',
      title: 'Microsoft Certified: Azure Administrator Associate', org: 'Microsoft', when: 'Certification',
      summary: 'Running and securing workloads on Azure: virtual machines, AKS, Entra ID and Blob Storage.',
      points: [], tags: ['VMs', 'AKS', 'Entra ID', 'Blob Storage'],
      links: [['Verify on Microsoft Learn', 'https://learn.microsoft.com/en-gb/users/olalekanamoo-5400/credentials/3231464c72d9e658']],
    },
  ];
  const KIND = { role: ['Role', 'f-role', '0 0 60 66'], project: ['Project', 'f-project', '0 0 60 66'], cert: ['Certification', 'f-cert', '0 0 60 60'] };

  // ---- decorative leaves around the canopy (seeded so they never jump around) ----
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const leafG = svg.getElementById ? svg.querySelector('#leaves') : null;
  if (leafG) {
    const blobs = [...svg.querySelectorAll('#canopy-back circle')];
    const colors = ['#8fab78', '#9fb889', '#b7cba2', '#7e9c69'];
    let html = '';
    blobs.forEach(c => {
      const cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), r = +c.getAttribute('r');
      for (let i = 0; i < 7; i++) {
        const a = rnd() * Math.PI * 2;
        const d = r * (0.82 + rnd() * 0.22);
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
        if (y > 610) continue;
        const rot = (a * 180) / Math.PI + 90 + (rnd() * 40 - 20);
        const s = 0.7 + rnd() * 0.6;
        html += `<path d="M0 0c6-9 20-9 26 0-6 8-20 8-26 0z" fill="${colors[(rnd() * 4) | 0]}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(0)}) scale(${s.toFixed(2)})"/>`;
      }
    });
    leafG.innerHTML = html;
  }

  // ---- build fruit ----
  const dotsHtml = items.map(() => '<i></i>').join('');
  document.querySelectorAll('.basket-dots').forEach(d => (d.innerHTML = dotsHtml));

  const els = new Map();
  items.forEach((it, i) => {
    const path = svg.querySelector('#' + it.branch);
    const p = path.getPointAtLength(path.getTotalLength() * it.t);
    it.x = p.x; it.y = p.y;
    const [kindName, sym, vb] = KIND[it.kind];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'fruit fruit--' + it.kind;
    b.style.setProperty('--dur', (4.2 + (i % 3) * 0.7) + 's');
    b.style.setProperty('--delay', (-i * 0.9) + 's');
    b.setAttribute('aria-label', `${kindName}: ${it.title}${it.org ? ', ' + it.org : ''}. Pluck to read more.`);
    b.innerHTML = `<span class="fruit-swing"><span class="string"></span><span class="fruit-body"><svg viewBox="${vb}"><use href="#${sym}"/></svg></span><span class="fruit-label">${it.label}</span></span>`;
    b.addEventListener('click', () => pluck(it));
    stage.appendChild(b);
    els.set(it.id, b);
  });

  function placeFruit() {
    VB = narrow.matches ? [100, 80, 800, 920] : [0, 0, 1000, 1000];
    const [vx, vy, vw, vh] = VB;
    svg.setAttribute('viewBox', VB.join(' '));
    stage.style.aspectRatio = vw + ' / ' + vh;
    items.forEach(it => {
      const b = els.get(it.id);
      b.style.left = ((it.x - vx) / vw) * 100 + '%';
      b.style.top = ((it.y - vy) / vh) * 100 + '%';
      const len = (narrow.matches && it.mLen) || it.len;
      b.style.setProperty('--len', (len / vw) * 100 + 'cqw');
      b.style.setProperty('--size', (it.size / vw) * 100 + 'cqw');
    });
  }
  placeFruit();

  const picked = new Set();
  let current = null;

  // where a fallen fruit rests: same x, sitting on the soil, nudged so neighbours don't stack
  function dropDistance(it) {
    const b = els.get(it.id);
    const body = b.querySelector('.fruit-body');
    const stageBox = stage.getBoundingClientRect();
    const bodyBox = body.getBoundingClientRect();
    const groundPx = stageBox.top + ((GROUND - VB[1]) / VB[3]) * stageBox.height;
    return groundPx - bodyBox.bottom + bodyBox.height * 0.18;
  }

  function settle(it, animate) {
    const b = els.get(it.id);
    const body = b.querySelector('.fruit-body');
    body.getAnimations().forEach(a => a.cancel());
    const swing = b.querySelector('.fruit-swing');
    swing.style.transform = 'translateX(-50%)';
    const dy = dropDistance(it);
    const spin = it.x < 500 ? -24 : 24;
    const end = `translateY(${dy}px) rotate(${spin}deg)`;
    if (!animate || reduce) {
      body.style.transform = end;
      return Promise.resolve();
    }
    const anim = body.animate(
      [
        { transform: 'translateY(0) rotate(0deg)', easing: 'cubic-bezier(.55,0,1,.45)' },
        { transform: `translateY(${dy}px) rotate(${spin * 0.8}deg)`, offset: 0.78, easing: 'ease-out' },
        { transform: `translateY(${dy - 12}px) rotate(${spin * 0.95}deg)`, offset: 0.89, easing: 'ease-in' },
        { transform: end },
      ],
      { duration: 780 }
    );
    return anim.finished.then(() => { body.style.transform = end; anim.cancel(); });
  }

  function pluck(it) {
    const b = els.get(it.id);
    if (!picked.has(it.id)) {
      picked.add(it.id);
      b.classList.add('is-picked');
      settle(it, true).then(() => show(it));
      updateCount();
    } else {
      show(it);
    }
  }

  function show(it) {
    current && els.get(current).classList.remove('is-current');
    current = it.id;
    els.get(it.id).classList.add('is-current');
    const q = s => panel.querySelector(s);
    q('[data-kind]').textContent = KIND[it.kind][0];
    q('[data-title]').textContent = it.title;
    q('[data-org]').textContent = it.org;
    q('[data-when]').textContent = it.when;
    q('[data-summary]').textContent = it.summary;
    const pts = q('[data-points]');
    pts.innerHTML = '';
    it.points.forEach(t => { const li = document.createElement('li'); li.textContent = t; pts.appendChild(li); });
    pts.hidden = !it.points.length;
    const tags = q('[data-tags]');
    tags.innerHTML = '';
    it.tags.forEach(t => { const li = document.createElement('li'); li.textContent = t; tags.appendChild(li); });
    const act = q('[data-actions]');
    const talk = it.kind === 'role' ? 'Ask me about this role' : it.kind === 'project' ? 'Want something like this?' : 'Let’s talk';
    act.innerHTML = `<a class="btn btn--lime btn--sm" href="${CONTACT}">${talk} <svg><use href="#i-arrow"/></svg></a>` +
      it.links.map(([t, u]) => `<a class="link-arrow" href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join('');
    q('[data-finale]').hidden = picked.size !== items.length;
    layout.classList.add('has-pick');
    document.body.classList.add('sheet-open');
    panel.scrollTop = 0;
    panel.focus({ preventScroll: true });
  }

  function close() {
    document.body.classList.remove('sheet-open');
    if (innerWidth > 900) layout.classList.remove('has-pick');
    current && els.get(current).classList.remove('is-current');
    current && els.get(current).focus({ preventScroll: true });
    current = null;
  }

  function updateCount() {
    const n = picked.size;
    document.querySelectorAll('[data-count]').forEach(c => (c.textContent = `${n} of ${items.length} picked`));
    document.querySelectorAll('.basket-dots').forEach(d => [...d.children].forEach((dot, i) => dot.classList.toggle('on', i < n)));
  }

  panel.querySelector('.panel-close').addEventListener('click', close);
  // on phones, tapping the tree (not a fruit) closes the sheet
  stage.addEventListener('click', e => {
    if (document.body.classList.contains('sheet-open') && !e.target.closest('.fruit, .roots-link')) close();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape' && current) close(); });
  panel.querySelector('[data-reset]').addEventListener('click', () => {
    picked.forEach(id => {
      const b = els.get(id);
      const body = b.querySelector('.fruit-body');
      body.getAnimations().forEach(a => a.cancel());
      body.style.transform = '';
      b.querySelector('.fruit-swing').style.transform = '';
      b.classList.remove('is-picked', 'is-current');
    });
    picked.clear();
    updateCount();
    current = null;
    document.body.classList.remove('sheet-open');
    layout.classList.remove('has-pick');
  });

  // keep fallen fruit on the ground when the window size changes
  let rt;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => (placeFruit(), picked).forEach(id => {
      const it = items.find(i => i.id === id);
      const body = els.get(id).querySelector('.fruit-body');
      body.style.transform = '';
      settle(it, false);
    }), 120);
  });
})();
