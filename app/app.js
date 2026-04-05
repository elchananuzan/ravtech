// === State Management ===
const STORAGE_KEY = 'shaar-habitachon-data';

function getState() {
  const defaults = {
    completedDays: {},  // { 'YYYY-WW-D': true }
    totalCompletions: 0,
    currentStreak: 0,
    totalDaysLearned: 0,
    lastLearnedDate: null,
    reminderEnabled: false,
    reminderHour: 8,
    reminderMinute: 0
  };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// === Date Helpers ===
function getTodayDayIndex() {
  // Sunday = 0 maps to Day 1, Saturday = 6 maps to Day 7
  return new Date().getDay(); // 0-6
}

function getWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${weekNum}`;
}

function getDayKey(dayIndex) {
  return `${getWeekKey()}-${dayIndex}`;
}

function getDateString() {
  return new Date().toISOString().split('T')[0];
}

function getCompletedThisWeek(state) {
  const weekKey = getWeekKey();
  let count = 0;
  for (let i = 0; i < 7; i++) {
    if (state.completedDays[`${weekKey}-${i}`]) count++;
  }
  return count;
}

// === Render Functions ===
function renderProgress(state) {
  const completed = getCompletedThisWeek(state);
  const pct = Math.round((completed / 7) * 100);

  document.getElementById('progressFill').style.width = `${pct}%`;
  document.getElementById('progressText').textContent = `${completed} / 7 ימים השבוע`;

  const weekCounter = document.getElementById('weekCounter');
  if (state.totalCompletions > 0) {
    weekCounter.textContent = `סה״כ ${state.totalCompletions} סיומים!`;
  } else {
    weekCounter.textContent = '';
  }
}

function renderTodayCard(state) {
  const todayIdx = getTodayDayIndex();
  const portion = WEEKLY_PORTIONS[todayIdx];
  const card = document.getElementById('todayCard');
  const isDone = state.completedDays[getDayKey(todayIdx)];

  card.style.display = 'block';

  document.getElementById('todayTitle').textContent = `${portion.dayName} · ${portion.title}`;
  document.getElementById('todaySubtitle').textContent = portion.subtitle;

  // Render topics
  const topicsEl = document.getElementById('todayTopics');
  topicsEl.innerHTML = portion.topics.map(t =>
    `<div class="topic-item"><span class="topic-bullet">◆</span>${t}</div>`
  ).join('');

  // Sefaria link
  document.getElementById('sefariaLink').href = portion.sefariaUrl;

  // Mark done button
  const btn = document.getElementById('markDoneBtn');
  if (isDone) {
    btn.textContent = '✓ סיימתי!';
    btn.classList.add('done');
    btn.disabled = true;
  } else {
    btn.textContent = '✓ סיימתי את הלימוד';
    btn.classList.remove('done');
    btn.disabled = false;
  }
}

function renderDaysList(state) {
  const list = document.getElementById('daysList');
  const todayIdx = getTodayDayIndex();
  const weekKey = getWeekKey();

  list.innerHTML = WEEKLY_PORTIONS.map((portion, i) => {
    const isToday = i === todayIdx;
    const isCompleted = state.completedDays[`${weekKey}-${i}`];
    const classes = ['day-card'];
    if (isToday) classes.push('today');
    if (isCompleted) classes.push('completed');

    const statusIcon = isCompleted ? '✓' : (isToday ? '◀' : '');

    return `
      <div class="${classes.join(' ')}" data-day="${i}">
        <div class="day-number">${isCompleted ? '✓' : DAYS_HEB[i].charAt(0) + '׳'}</div>
        <div class="day-info">
          <h3>${portion.title}</h3>
          <p>${portion.subtitle}</p>
        </div>
        <div class="day-status">${statusIcon}</div>
      </div>
    `;
  }).join('');

  // Add click listeners
  list.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('click', () => {
      const dayIdx = parseInt(card.dataset.day);
      showDayDetail(dayIdx, state);
    });
  });
}

function showDayDetail(dayIdx, state) {
  const portion = WEEKLY_PORTIONS[dayIdx];
  const overlay = document.getElementById('dayDetailOverlay');
  const content = document.getElementById('dayDetailContent');
  const isDone = state.completedDays[getDayKey(dayIdx)];

  content.innerHTML = `
    <div class="detail-header">
      <h2>${portion.dayName}</h2>
      <h3>${portion.title}</h3>
      <p>${portion.subtitle}</p>
    </div>
    ${portion.sections.map(s => `
      <div class="detail-section">
        <h4>${s.heading}</h4>
        <p>${s.description}</p>
        <span class="segments-ref">${s.segments}</span>
      </div>
    `).join('')}
    <div class="detail-topics">
      <h4>נושאים עיקריים:</h4>
      <ul>${portion.topics.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>
  `;

  document.getElementById('detailSefariaLink').href = portion.sefariaUrl;

  const btn = document.getElementById('detailMarkDoneBtn');
  if (isDone) {
    btn.textContent = '✓ סיימתי!';
    btn.classList.add('done');
    btn.disabled = true;
  } else {
    btn.textContent = '✓ סיימתי';
    btn.classList.remove('done');
    btn.disabled = false;
    btn.onclick = () => markDayComplete(dayIdx);
  }

  overlay.style.display = 'flex';
}

function closeDayDetail() {
  document.getElementById('dayDetailOverlay').style.display = 'none';
}

function renderStats(state) {
  document.getElementById('totalCompletions').textContent = state.totalCompletions;
  document.getElementById('currentStreak').textContent = state.currentStreak;
  document.getElementById('totalDays').textContent = state.totalDaysLearned;
}

// === Actions ===
function markDayComplete(dayIdx) {
  const state = getState();
  const key = getDayKey(dayIdx);

  if (state.completedDays[key]) return;

  state.completedDays[key] = true;
  state.totalDaysLearned++;

  // Update streak
  const today = getDateString();
  if (state.lastLearnedDate) {
    const last = new Date(state.lastLearnedDate);
    const now = new Date(today);
    const diffDays = Math.round((now - last) / 86400000);
    if (diffDays <= 1) {
      state.currentStreak++;
    } else {
      state.currentStreak = 1;
    }
  } else {
    state.currentStreak = 1;
  }
  state.lastLearnedDate = today;

  // Check weekly completion
  const completedThisWeek = getCompletedThisWeek(state);
  if (completedThisWeek === 7) {
    state.totalCompletions++;
    showCelebration(state.totalCompletions);
  }

  saveState(state);
  renderAll();
}

function showCelebration(count) {
  const overlay = document.createElement('div');
  overlay.className = 'celebration-overlay';
  overlay.innerHTML = `
    <div class="celebration-card">
      <h2>מזל טוב!</h2>
      <p>סיימת את שער הביטחון!<br>זה הסיום ה-${count} שלך!</p>
      <p>״בטחו בה׳ עדי עד כי בי-ה ה׳ צור עולמים״</p>
      <button class="btn btn-primary" onclick="this.closest('.celebration-overlay').remove()">
        אמן! המשך ללמוד
      </button>
    </div>
  `;
  document.body.appendChild(overlay);
}

// === Reminders ===
async function setupReminder() {
  const toggle = document.getElementById('reminderToggle');
  const timeSection = document.getElementById('reminderTimeSection');
  const statusEl = document.getElementById('reminderStatus');
  const state = getState();

  toggle.checked = state.reminderEnabled;
  timeSection.style.display = state.reminderEnabled ? 'flex' : 'none';

  if (state.reminderEnabled) {
    const h = String(state.reminderHour).padStart(2, '0');
    const m = String(state.reminderMinute).padStart(2, '0');
    document.getElementById('reminderTime').value = `${h}:${m}`;
    statusEl.textContent = `תזכורת מוגדרת לשעה ${h}:${m}`;
  }

  toggle.addEventListener('change', async () => {
    if (toggle.checked) {
      // Request notification permission
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          timeSection.style.display = 'flex';
          const s = getState();
          s.reminderEnabled = true;
          saveState(s);
          statusEl.textContent = 'תזכורת מופעלת! בחר שעה ולחץ שמור.';
        } else {
          toggle.checked = false;
          statusEl.textContent = 'יש לאפשר התראות בהגדרות הדפדפן.';
        }
      } else {
        toggle.checked = false;
        statusEl.textContent = 'הדפדפן לא תומך בהתראות.';
      }
    } else {
      timeSection.style.display = 'none';
      const s = getState();
      s.reminderEnabled = false;
      saveState(s);
      statusEl.textContent = 'תזכורת כבויה.';
    }
  });

  document.getElementById('saveReminder').addEventListener('click', () => {
    const time = document.getElementById('reminderTime').value;
    const [h, m] = time.split(':').map(Number);
    const s = getState();
    s.reminderHour = h;
    s.reminderMinute = m;
    s.reminderEnabled = true;
    saveState(s);

    // Schedule via service worker
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        hour: h,
        minute: m
      });
    }

    statusEl.textContent = `תזכורת נשמרה לשעה ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  });
}

// === Reset ===
function setupReset() {
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('האם אתה בטוח שברצונך לאפס את כל הנתונים?')) {
      localStorage.removeItem(STORAGE_KEY);
      renderAll();
    }
  });
}

// === Render All ===
function renderAll() {
  const state = getState();
  renderProgress(state);
  renderTodayCard(state);
  renderDaysList(state);
  renderStats(state);
}

// === Init ===
function init() {
  renderAll();
  setupReminder();
  setupReset();

  // Close detail overlay
  document.getElementById('closeDayDetail').addEventListener('click', closeDayDetail);
  document.getElementById('dayDetailOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDayDetail();
  });

  // Mark done from today card
  document.getElementById('markDoneBtn').addEventListener('click', () => {
    markDayComplete(getTodayDayIndex());
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('Service Worker registered');
        // Re-schedule reminder if enabled
        const state = getState();
        if (state.reminderEnabled && reg.active) {
          reg.active.postMessage({
            type: 'SCHEDULE_NOTIFICATION',
            hour: state.reminderHour,
            minute: state.reminderMinute
          });
        }
      })
      .catch(err => console.log('SW registration failed:', err));
  }
}

document.addEventListener('DOMContentLoaded', init);
