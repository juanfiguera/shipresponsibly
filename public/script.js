// ── QUIZ ──
const questions = [
  { q: "When was the last time you read the code your AI wrote for you?", opts: [
    { text: "I review every line", score: 0 }, { text: "I skim for red flags", score: 1 },
    { text: "If it runs, it's reviewed", score: 2 }, { text: "There's code?", score: 3 }
  ]},
  { q: "How do you test your vibecoded app?", opts: [
    { text: "Automated test suite", score: 0 }, { text: "I click around for a bit", score: 1 },
    { text: "I send it to my friend and ask 'does this work?'", score: 2 }, { text: "Production IS my test environment", score: 3 }
  ]},
  { q: "How many energy drinks have you consumed during this sprint?", opts: [
    { text: "Zero, I'm hydrated and rested", score: 0 }, { text: "One or two, it's fine", score: 1 },
    { text: "I've lost count and my eye is twitching", score: 2 }, { text: "I have transcended the need for sleep", score: 3 }
  ]},
  { q: "Your vibecoded app handles user passwords by:", opts: [
    { text: "Bcrypt hashing with proper salting", score: 0 }, { text: "Whatever the AI suggested, probably fine", score: 1 },
    { text: "Stored in a JSON file called passwords.json", score: 2 }, { text: "Wait, I need to handle passwords?", score: 3 }
  ]},
  { q: "It's Friday at 4:55 PM. You just finished a feature. Do you:", opts: [
    { text: "Open a PR and go home", score: 0 }, { text: "Deploy to staging, test Monday", score: 1 },
    { text: "Push to prod, what could go wrong", score: 2 }, { text: "Push to prod AND leave for vacation", score: 3 }
  ]}
];

let currentQ = 0, answers = [], selectedIdx = null;
const quizCard = document.getElementById('quizCard');
const resultCard = document.getElementById('resultCard');
const quizQ = document.getElementById('quizQ');
const quizOpts = document.getElementById('quizOpts');
const quizCounter = document.getElementById('quizCounter');
const quizNext = document.getElementById('quizNext');

function renderQuestion() {
  const q = questions[currentQ];
  quizQ.textContent = q.q;
  quizOpts.innerHTML = '';
  selectedIdx = null;
  quizNext.disabled = true;
  quizNext.textContent = currentQ === questions.length - 1 ? 'See results \u2192' : 'Next \u2192';
  quizCounter.textContent = `${currentQ + 1} / ${questions.length}`;
  const letters = ['A','B','C','D'];
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-btn';
    btn.innerHTML = `<span class="letter">${letters[i]}</span> ${opt.text}`;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quiz-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedIdx = i;
      quizNext.disabled = false;
    });
    quizOpts.appendChild(btn);
  });
}

quizNext.addEventListener('click', () => {
  if (selectedIdx === null) return;
  answers.push(questions[currentQ].opts[selectedIdx].score);
  currentQ++;
  if (currentQ < questions.length) renderQuestion();
  else showResults();
});

function showResults() {
  const total = answers.reduce((a, b) => a + b, 0);
  const pct = Math.round((total / (questions.length * 3)) * 100);
  quizCard.style.display = 'none';
  resultCard.classList.add('visible');
  const scoreEl = document.getElementById('resultScore');
  const labelEl = document.getElementById('resultLabel');
  const msgEl = document.getElementById('resultMsg');
  scoreEl.textContent = pct + '%';
  if (pct <= 25) {
    scoreEl.className = 'result-score low';
    labelEl.textContent = 'Responsible Shipper';
    msgEl.textContent = 'You actually read your code. You beautiful, paranoid unicorn. The world needs more of you.';
  } else if (pct <= 55) {
    scoreEl.className = 'result-score mid';
    labelEl.textContent = 'Shipping Buzzed';
    msgEl.textContent = "You're cutting corners and you know it. That 'it's probably fine' voice in your head? That's not your conscience. That's technical debt whispering.";
  } else {
    scoreEl.className = 'result-score high';
    labelEl.textContent = 'Reckless Deployment';
    msgEl.textContent = "Please step away from the deploy button. Your users did not sign a waiver. Consider this your intervention.";
  }
}

document.getElementById('retakeBtn').addEventListener('click', () => {
  currentQ = 0; answers = []; selectedIdx = null;
  resultCard.classList.remove('visible');
  quizCard.style.display = 'block';
  renderQuestion();
});

renderQuestion();

// ── PLEDGE WALL ──
const seedNames = ['@shipit_sarah','DevDave','NotABot_Karen','@yolo_deployer','ctrl+z_specialist','Jessica M.','@friday_pm_pusher','Anonymous (reformed)','TypeScriptTony','@the_lgtm_machine','ProdIsMyStaging_Pete','Becky from QA','@no_tests_no_cry'];
const pledgeWall = document.getElementById('pledgeWall');
const pledgeInput = document.getElementById('pledgeInput');
const pledgeBtn = document.getElementById('pledgeBtn');

seedNames.forEach((name, i) => {
  const el = document.createElement('span');
  el.className = 'pledge-name'; el.textContent = name;
  el.style.animationDelay = `${i * 0.06}s`;
  pledgeWall.appendChild(el);
});

pledgeBtn.addEventListener('click', () => {
  const val = pledgeInput.value.trim();
  if (!val) return;
  const el = document.createElement('span');
  el.className = 'pledge-name'; el.textContent = val;
  el.style.border = '1px solid #c9a84c';
  el.style.color = '#0a0a0a';
  pledgeWall.prepend(el);
  pledgeInput.value = '';
});

pledgeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') pledgeBtn.click(); });

// ── HORROR STORY SUBMISSION ──
document.getElementById('horrorBtn').addEventListener('click', () => {
  const text = document.getElementById('horrorText').value.trim();
  if (!text) return;
  document.getElementById('horrorCard').style.display = 'none';
  document.getElementById('horrorSuccess').classList.add('visible');
});

// ── PLAYBOOK CLICK TRACKING ──
// /playbook is a server redirect to Gumroad, so no page-view event fires there.
// Track clicks on any CTA pointing at /playbook with gtag + transport:beacon
// so the event is sent even though the browser navigates immediately.
document.querySelectorAll('a[href="/playbook"]').forEach((link) => {
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
