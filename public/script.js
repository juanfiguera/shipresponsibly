// ── Horror stories dataset ──────────────────────────────────────
const SR_STORIES = [
  {
    category: 'Payments',
    severity: 'SEV-1',
    title: 'The Double-Charge Incident',
    body: 'Vibecoded a Stripe integration for a client. Three weeks later, every transaction had been charged twice. The refund process took longer than writing the app.',
    who: 'Freelance developer',
    loss: '$47,200 in refunds',
    lesson: 'Idempotency keys are not optional.',
  },
  {
    category: 'Security',
    severity: 'SEV-1',
    title: 'Salaries in the Console',
    body: 'Built an internal HR tool over a weekend. It worked great until someone pointed out every employee’s salary was visible in the browser console.',
    who: 'Ops lead, Series B startup',
    loss: '1 resignation, 1 HR investigation',
    lesson: 'The client is a hostile environment.',
  },
  {
    category: 'Data Loss',
    severity: 'SEV-2',
    title: 'Inbox Zero, Literally',
    body: 'My AI agent had full access to my email. I asked it to "clean up my inbox." It archived three months of client correspondence, including active deal threads.',
    who: 'Founder',
    loss: '2 deals, ~$180k ARR',
    lesson: 'Agents need scopes, not intentions.',
  },
  {
    category: 'Infra',
    severity: 'SEV-2',
    title: 'The Infinite Cron',
    body: 'Asked Claude for a "simple cleanup script on a cron." It ran every minute instead of every day. Hit the API 43,000 times before anyone noticed the bill alert.',
    who: 'Solo indie hacker',
    loss: '$8,400 overage',
    lesson: 'Read the crontab out loud.',
  },
  {
    category: 'Auth',
    severity: 'SEV-1',
    title: 'JWT = Just Wishful Tokens',
    body: '"It has auth" was how the dev described the dashboard. Turns out every user’s token was the literal string "admin". Discovered during a live demo.',
    who: 'CTO, seed-stage',
    loss: '1 failed investor meeting',
    lesson: 'Default deny. Test with a hostile user.',
  },
  {
    category: 'Privacy',
    severity: 'SEV-2',
    title: 'Sent To Wrong Continent',
    body: 'The welcome-email flow looked fine in dev. In prod it shipped every new signup’s details to a mailing list the AI invented. The list was public.',
    who: 'Growth engineer',
    loss: 'GDPR inquiry pending',
    lesson: 'Ship to staging. Stage it for a week.',
  },
];

// ── Self-assessment (5 questions, weighted, bucketed into 5 levels) ──
const SR_ASSESSMENT = (function () {
  const QUESTIONS = [
    {
      id: 'users',
      q: 'Who is going to use this?',
      a: [
        { t: 'Just me', v: 0 },
        { t: 'A few friends / teammates', v: 8 },
        { t: 'My company internally', v: 14 },
        { t: 'Paying customers', v: 20 },
        { t: 'The general public, at scale', v: 24 },
      ],
    },
    {
      id: 'data',
      q: 'What data does it touch?',
      a: [
        { t: 'None, really — stateless', v: 0 },
        { t: 'My own files / my own account', v: 6 },
        { t: 'Other people’s emails, DMs, or calendars', v: 16 },
        { t: 'Financial, medical, or legal records', v: 22 },
        { t: 'All of the above, plus keys to other systems', v: 24 },
      ],
    },
    {
      id: 'blast',
      q: 'If it goes wrong at 3am, what breaks?',
      a: [
        { t: 'Nothing, I just re-run it', v: 0 },
        { t: 'A little data I can recover from backups', v: 6 },
        { t: 'A workflow my team depends on', v: 12 },
        { t: 'Money moves to the wrong place', v: 18 },
        { t: 'Someone gets hurt, sued, or fired', v: 22 },
      ],
    },
    {
      id: 'review',
      q: 'Has anyone other than the AI read this code?',
      a: [
        { t: 'Yes, a senior engineer reviewed it line-by-line', v: -4 },
        { t: 'I skimmed it and it looked fine', v: 6 },
        { t: 'I accepted every diff and ran the thing', v: 14 },
        { t: 'I didn’t open the files', v: 18 },
        { t: 'Files? There are files?', v: 22 },
      ],
    },
    {
      id: 'agents',
      q: 'What can your agents do without asking?',
      a: [
        { t: 'Read-only, sandbox, dry runs', v: 0 },
        { t: 'Write files in one project directory', v: 6 },
        { t: 'Run shell commands on my laptop', v: 12 },
        { t: 'Deploy, send email, move money', v: 18 },
        { t: 'Anything. It has my credit card and my soul.', v: 22 },
      ],
    },
  ];

  const LEVELS = [
    {
      min: 0, max: 19,
      code: 'L1',
      name: 'Fine. Ship it.',
      tag: 'LOW RISK',
      color: '#2E7D32',
      verdict: 'The worst-case scenario is you. Proceed.',
      prescription: 'Commit. Push. Don’t over-engineer a photo-renamer.',
    },
    {
      min: 20, max: 39,
      code: 'L2',
      name: 'Mild vibes detected.',
      tag: 'CAUTION',
      color: '#F9A825',
      verdict: 'Probably okay. Read the diff before you merge.',
      prescription: 'Add one test, one error boundary, one README. You’ll thank yourself.',
    },
    {
      min: 40, max: 59,
      code: 'L3',
      name: 'Stop vibing. Start reading.',
      tag: 'ELEVATED',
      color: '#E65100',
      verdict: 'Real people will feel this when it breaks.',
      prescription: 'Actually read every file. Rotate keys. Run one security scan. Have a rollback plan.',
    },
    {
      min: 60, max: 79,
      code: 'L4',
      name: 'Shipping under the influence.',
      tag: 'HIGH RISK',
      color: '#C62828',
      verdict: 'This needs an adult in the room.',
      prescription: 'Pair with a senior engineer. Stage it. Audit the agent scopes. No Friday deploys.',
    },
    {
      min: 80, max: 999,
      code: 'L5',
      name: 'Call a lawyer.',
      tag: 'CRITICAL',
      color: '#7B1FA2',
      verdict: 'You are one bad prompt away from a headline.',
      prescription: 'Do not ship. Hire a review. Write a threat model. Tell your insurance carrier.',
    },
  ];

  function score(answers) {
    let total = 0;
    for (const q of QUESTIONS) {
      const idx = answers[q.id];
      if (idx == null) continue;
      total += q.a[idx].v;
    }
    total = Math.max(0, Math.min(100, total));
    const level = LEVELS.find((l) => total >= l.min && total <= l.max) || LEVELS[0];
    return { total, level };
  }

  function certificateId(seed) {
    const s = (seed || Math.random().toString(36)).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const n = (s * 2654435761) >>> 0;
    const hex = n.toString(16).toUpperCase().padStart(8, '0');
    return `DS-2026-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
  }

  return { QUESTIONS, LEVELS, score, certificateId };
})();

// ── Warning ticker ───────────────────────────────────────────────
(function initTrack() {
  const items = [
    'SHIPPING FRIDAY AT 5PM · WHAT COULD GO WRONG?',
    'VIBECODING STRAIGHT TO PROD · IS NOT A BUSINESS STRATEGY',
    'YOUR API KEY IS IN A PUBLIC REPO · AGAIN',
    'THE AGENT SHIPPED IT · WHILE YOU WERE ASLEEP',
    'HOPE · IS NOT A DEPLOYMENT PIPELINE',
    'CUSTOMER SUPPORT · FOUND THE BUG · BEFORE YOU DID',
    'ROTATING KEYS AFTER A LEAK · DOES NOT COUNT AS PROACTIVE',
    'YES · THE DATABASE IS CALLED TEST · IN PRODUCTION',
    'GIT PUSH --FORCE TO MAIN · ON A FRIDAY · BOLD MOVE',
    'READING THE CODE · REMAINS AN UNDEFEATED STRATEGY',
    'YOUR TEST SUITE PASSES · BECAUSE IT DOES NOTHING',
    'THE DEMO WORKED · BECAUSE IT WAS A SCREENSHOT',
  ];
  const track = document.getElementById('track');
  if (!track) return;
  const group = document.createDocumentFragment();
  for (let r = 0; r < 2; r++) {
    for (const i of items) {
      const s = document.createElement('span');
      s.innerHTML = '<span class="tri"></span>' + i;
      group.appendChild(s);
    }
  }
  track.appendChild(group);
})();

// ── Pledge with toast + signed card ──────────────────────────────
(function pledge() {
  const btn = document.getElementById('pledge-btn');
  const nm = document.getElementById('pledge-name');
  const toast = document.getElementById('pledge-toast');
  const card = document.getElementById('signed-card');
  const canvas = document.getElementById('signed-canvas');
  const dlBtn = document.getElementById('signed-dl');
  const shareLink = document.getElementById('signed-share');
  if (!btn || !nm) return;

  function flashToast() {
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(flashToast._t);
    flashToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function drawSignedCard(name) {
    if (!canvas) return;
    const g = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const paper = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() || '#f4f1ea';
    const ink = '#111111';
    const acc = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#FF6A13';
    g.fillStyle = paper; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 3000; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.04})`; g.fillRect(Math.random() * W, Math.random() * H, 1, 1); }
    g.fillStyle = ink; g.fillRect(0, 0, W, 56);
    g.fillStyle = acc; g.font = 'bold 14px "JetBrains Mono", monospace';
    g.fillText('\u00A7 05 \u00B7 THE RESPONSIBLE SHIPPER\u2019S OATH', 36, 36);
    g.fillStyle = paper; g.textAlign = 'right'; g.fillText('SHIPRESPONSIBLY.COM', W - 36, 36); g.textAlign = 'left';
    g.strokeStyle = ink; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, H - 6);
    g.lineWidth = 2; g.strokeRect(20, 76, W - 40, H - 96);
    g.fillStyle = ink; g.font = 'bold 44px "Archivo Black", sans-serif';
    const oath = ['I SWEAR TO READ MY OWN', 'CODE BEFORE I DEPLOY IT.', 'I WILL NOT SHIP UNDER', 'THE INFLUENCE.'];
    oath.forEach((ln, i) => g.fillText(ln, 60, 180 + i * 56));
    g.fillStyle = acc; g.fillRect(60, 400, 400, 8);
    g.fillStyle = ink; g.font = '14px "JetBrains Mono", monospace';
    g.fillText('SIGNED \u00B7 ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase(), 60, 460);
    g.strokeStyle = ink; g.lineWidth = 2;
    g.beginPath(); g.moveTo(60, 530); g.lineTo(700, 530); g.stroke();
    g.font = 'italic 42px "Archivo", serif';
    g.fillText(name, 70, 518);
    g.save(); g.translate(W - 180, H / 2 - 10);
    g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 110, 0, Math.PI * 2); g.stroke();
    g.lineWidth = 1; g.beginPath(); g.arc(0, 0, 100, 0, Math.PI * 2); g.stroke();
    g.fillStyle = ink; g.beginPath(); g.arc(0, 0, 70, 0, Math.PI * 2); g.fill();
    g.fillStyle = paper; g.font = 'bold 16px "JetBrains Mono", monospace'; g.textAlign = 'center';
    g.fillText('PLEDGED', 0, -6); g.fillText(new Date().getFullYear(), 0, 18);
    g.restore();
    g.fillStyle = acc; g.fillRect(0, H - 42, W, 42);
    g.fillStyle = ink; g.font = 'bold 14px "JetBrains Mono", monospace'; g.textAlign = 'left';
    g.fillText('DEPT. OF SHIPPING \u00B7 \u00A7 05.001', 36, H - 16);
    g.textAlign = 'right'; g.fillText('SHIPRESPONSIBLY.COM', W - 36, H - 16);
  }

  btn.onclick = () => {
    const name = nm.value.trim();
    if (!name) { nm.focus(); return; }
    flashToast();
    btn.textContent = 'Signed \u2713'; btn.disabled = true; nm.disabled = true;
    drawSignedCard(name);
    if (card) card.classList.add('show');
    const url = encodeURIComponent('https://shipresponsibly.com');
    const text = encodeURIComponent('I just signed the Responsible Shipper\u2019s Oath. No more shipping under the influence.');
    if (shareLink) shareLink.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  };
  if (dlBtn) dlBtn.onclick = () => {
    const a = document.createElement('a');
    a.download = 'ship-responsibly-pledge.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  };
  nm.addEventListener('keydown', (e) => { if (e.key === 'Enter') btn.click(); });
})();

// ── Horror stories ───────────────────────────────────────────────
(function stories() {
  const el = document.getElementById('stories');
  if (!el) return;
  for (const s of SR_STORIES) {
    const d = document.createElement('div');
    d.className = 'story';
    d.innerHTML = `
      <div class="meta"><span>${s.category.toUpperCase()}</span><span class="sev">${s.severity}</span></div>
      <h4 class="title">${s.title}</h4>
      <p class="body">${s.body}</p>
      <div class="foot">
        <div>${s.who} · ${s.loss}</div>
        <span class="lesson">▸ ${s.lesson}</span>
      </div>`;
    el.appendChild(d);
  }
  // Submit-your-own card
  const sub = document.createElement('div');
  sub.className = 'story submit';
  sub.innerHTML = `
    <h4 class="title">Got a story?</h4>
    <p class="sub">Submit anonymously. We'll scrub anything identifying.</p>
    <input type="text" placeholder="Your role (e.g. 'PM at a fintech startup')" />
    <textarea placeholder="What happened?"></textarea>
    <button class="cta">Submit →</button>`;
  sub.querySelector('.cta').addEventListener('click', () => {
    const textarea = sub.querySelector('textarea');
    if (!textarea.value.trim()) { textarea.focus(); return; }
    sub.innerHTML = '<h4 class="title">Submitted.</h4><p class="sub">Your pain will save someone else\'s weekend.</p>';
  });
  el.appendChild(sub);
})();


// ── Assessment ───────────────────────────────────────────────────
(function assess() {
  const root = document.getElementById('assess-app');
  if (!root) return;
  const A = SR_ASSESSMENT;
  const answers = {};
  let qIdx = 0;

  function render() {
    if (qIdx >= A.QUESTIONS.length) return renderResult();
    const q = A.QUESTIONS[qIdx];
    const pct = Math.round((qIdx / A.QUESTIONS.length) * 100);
    const ticks = A.QUESTIONS.map(() => '<span></span>').join('');
    root.innerHTML = `
      <div class="form-panel">
        <div class="form-header">
          <span>Form DS·005 — Self-Certification of Shipping Readiness</span>
          <span>${qIdx + 1} / ${A.QUESTIONS.length}</span>
        </div>
        <div class="form-progress"><div class="bar" style="width:${pct}%"></div><div class="ticks">${ticks}</div></div>
        <div class="form-body">
          <div class="form-q">
            <div class="q-text">${q.q}</div>
            <div class="opts" id="opts">
              ${q.a.map((a, i) => `
                <div class="opt ${answers[q.id] === i ? 'sel' : ''}" data-i="${i}">
                  <span class="ck"></span>
                  <span class="idx">${String.fromCharCode(65 + i)}</span>
                  <span>${a.t}</span>
                </div>`).join('')}
            </div>
          </div>
        </div>
        <div class="form-footer">
          <span>${qIdx === 0 ? 'No judgment. Okay, some judgment.' : 'Proceed honestly.'}</span>
          <div>
            ${qIdx > 0 ? `<button class="back">← Back</button>` : ''}
            <button class="next" ${answers[q.id] == null ? 'disabled' : ''}>Next →</button>
          </div>
        </div>
        ${qIdx === 0 ? '<a class="skip-link" href="#playbook">I know my risk level — skip to the playbook →</a>' : ''}
      </div>`;
    root.querySelectorAll('.opt').forEach(o => o.addEventListener('click', () => {
      answers[q.id] = +o.dataset.i;
      root.querySelectorAll('.opt').forEach(x => x.classList.remove('sel'));
      o.classList.add('sel');
      root.querySelector('.next').disabled = false;
    }));
    root.querySelector('.next').addEventListener('click', () => {
      if (answers[q.id] != null) { qIdx++; render(); }
    });
    const back = root.querySelector('.back');
    if (back) back.addEventListener('click', () => { qIdx--; render(); });
  }

  function renderResult() {
    const { total, level } = A.score(answers);
    const certId = A.certificateId(JSON.stringify(answers));
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
    root.innerHTML = `
      <div class="cert">
        <div class="cert-head">
          <span>OFFICIAL CERTIFICATE · DS·005</span>
          <span>${certId}</span>
        </div>
        <div class="cert-body">
          <div>
            <div class="lv-code">Classification · ${level.code}</div>
            <span class="lv-tag" style="background:${level.color};color:#fff;border-color:${level.color};">${level.tag}</span>
            <h3 class="lv-name">${level.name}</h3>
            <p class="lv-verdict">${level.verdict}</p>
            <div class="lv-rx"><span class="rx-label">℞ Prescription</span>${level.prescription}</div>
            <div class="cert-actions">
              <button class="cta primary" id="dl">Download certificate (PNG)</button>
              <button class="cta light" id="retake">Retake →</button>
            </div>
            <div class="share-row">
              <a class="share-btn" id="share-x" href="#" target="_blank" rel="noopener">Share on X</a>
              <a class="share-btn" id="share-ln" href="#" target="_blank" rel="noopener">LinkedIn</a>
              <button class="share-btn" id="share-copy">Copy link</button>
            </div>
          </div>
          <div class="score-dial">
            <div class="score-num" style="color:${level.color};">${total}</div>
            <div class="score-sub">of 100 · risk score</div>
          </div>
        </div>
        <div class="cert-foot">
          <span>Issued · ${date}</span>
          <span>Dept. of Shipping</span>
          <span>Non-transferable</span>
        </div>
      </div>`;
    root.querySelector('#retake').addEventListener('click', () => {
      qIdx = 0;
      for (const k in answers) delete answers[k];
      render();
    });
    root.querySelector('#dl').addEventListener('click', () => downloadCert(total, level, certId, date));
    const shareUrl = 'https://shipresponsibly.com';
    const shareText = `I scored ${total}/100 on shipresponsibly.com — "${level.name}". Don't ship like me.`;
    root.querySelector('#share-x').href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    root.querySelector('#share-ln').href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    const copyBtn = root.querySelector('#share-copy');
    copyBtn.onclick = async () => {
      try { await navigator.clipboard.writeText(`${shareText} ${shareUrl}`); copyBtn.textContent = 'Copied \u2713'; copyBtn.classList.add('copied'); setTimeout(() => { copyBtn.textContent = 'Copy link'; copyBtn.classList.remove('copied'); }, 1800); } catch {}
    };
    attachPlaybookTracking(root);
  }

  function downloadCert(total, level, id, date) {
    const W = 1200, H = 630;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const paper = getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() || '#f4f1ea';
    const ink = '#111111';
    const acc = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#FF6A13';
    g.fillStyle = paper; g.fillRect(0, 0, W, H);
    for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(0,0,0,${Math.random() * 0.04})`; g.fillRect(Math.random() * W, Math.random() * H, 1, 1); }
    g.fillStyle = acc; g.fillRect(0, 0, W, 64);
    g.fillStyle = ink; g.font = 'bold 18px "Archivo Black", sans-serif';
    g.fillText('DEPARTMENT OF SHIPPING · CERT. OF CLASSIFICATION', 36, 42);
    g.font = '14px "JetBrains Mono", monospace'; g.textAlign = 'right'; g.fillText(id, W - 36, 42); g.textAlign = 'left';
    g.strokeStyle = ink; g.lineWidth = 6; g.strokeRect(3, 3, W - 6, H - 6);
    g.lineWidth = 2; g.strokeRect(20, 84, W - 40, H - 104);
    g.fillStyle = level.color; g.font = 'bold 280px "Archivo Black", sans-serif'; g.textAlign = 'right';
    g.fillText(total, W - 60, 420);
    g.fillStyle = ink; g.font = '18px "JetBrains Mono", monospace'; g.fillText('/ 100 · RISK SCORE', W - 60, 450);
    g.textAlign = 'left';
    g.fillStyle = level.color; g.fillRect(60, 120, 240, 40);
    g.fillStyle = '#fff'; g.font = 'bold 16px "JetBrains Mono", monospace'; g.fillText(level.tag + ' · ' + level.code, 76, 146);
    g.fillStyle = ink; g.font = 'bold 76px "Archivo Black", sans-serif';
    wrap(g, level.name, 60, 230, 700, 76);
    g.font = '22px "Archivo", sans-serif'; g.fillStyle = '#333';
    wrap(g, level.verdict, 60, 380, 700, 30);
    g.fillStyle = ink; g.font = '14px "JetBrains Mono", monospace'; g.fillText('℞ PRESCRIPTION', 60, 470);
    g.font = '17px "Archivo", sans-serif'; g.fillStyle = '#333';
    wrap(g, level.prescription, 60, 498, 700, 24);
    g.strokeStyle = ink; g.beginPath(); g.moveTo(60, H - 80); g.lineTo(W - 60, H - 80); g.stroke();
    g.fillStyle = ink; g.font = '14px "JetBrains Mono", monospace';
    g.fillText('ISSUED ' + date.toUpperCase(), 60, H - 52);
    g.textAlign = 'center'; g.fillText('SHIPRESPONSIBLY.COM', W / 2, H - 52);
    g.textAlign = 'right'; g.fillText('NON-TRANSFERABLE', W - 60, H - 52);

    const a = document.createElement('a');
    a.download = `ship-responsibly-${id}.png`;
    a.href = c.toDataURL('image/png');
    a.click();
  }

  function wrap(g, text, x, y, maxW, lineH) {
    const words = text.split(' '); let line = ''; const lines = [];
    for (const w of words) {
      const test = line + w + ' ';
      if (g.measureText(test).width > maxW && line) { lines.push(line); line = w + ' '; } else line = test;
    }
    lines.push(line);
    lines.forEach((ln, i) => g.fillText(ln.trim(), x, y + i * lineH));
  }

  render();
})();

// ── Playbook click tracking ──────────────────────────────────────
// /playbook is a server redirect to Gumroad, so no page-view event fires there.
// Track clicks on any CTA pointing at /playbook with gtag + transport:beacon
// so the event is sent even though the browser navigates immediately.
function attachPlaybookTracking(scope) {
  const root = scope || document;
  root.querySelectorAll('a[href="/playbook"], a[href="/sample"]').forEach((link) => {
    if (link.dataset.trackAttached) return;
    link.dataset.trackAttached = '1';
    link.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'playbook_click', {
          event_category: 'outbound',
          event_label: link.textContent.trim(),
          transport_type: 'beacon',
        });
      }
    });
  });
}
attachPlaybookTracking();
