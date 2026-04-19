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
    reminderMinute: 0,
    snoozedUntil: 0,
    lastNotifiedDate: null
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

  // Read text button in detail
  const detailReadBtn = document.getElementById('detailSefariaLink');
  detailReadBtn.href = '#';
  detailReadBtn.textContent = '📖 קרא את הטקסט';
  detailReadBtn.removeAttribute('target');
  detailReadBtn.onclick = (e) => {
    e.preventDefault();
    closeDayDetail();
    openReader(dayIdx);
  };

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

// === Reminder Banner ===
function showReminderBanner(state) {
  const banner = document.getElementById('reminderBanner');
  const todayIdx = getTodayDayIndex();
  const isDone = state.completedDays[getDayKey(todayIdx)];
  const snoozedUntil = state.snoozedUntil || 0;
  const now = Date.now();

  // Show banner if: reminder enabled, not done today, not snoozed
  if (state.reminderEnabled && !isDone && now > snoozedUntil) {
    const portion = WEEKLY_PORTIONS[todayIdx];
    document.getElementById('reminderBannerMsg').textContent =
      `${portion.dayName} · ${portion.title}`;
    banner.style.display = 'flex';

    // Also show snooze options
    document.getElementById('snoozeCard').style.display = 'block';
  } else {
    banner.style.display = 'none';
    document.getElementById('snoozeCard').style.display = 'none';
  }
}

function setupBanner() {
  // Close banner
  document.getElementById('reminderBannerClose').addEventListener('click', () => {
    document.getElementById('reminderBanner').style.display = 'none';
  });

  // Snooze buttons
  document.querySelectorAll('.btn-snooze').forEach(btn => {
    btn.addEventListener('click', () => {
      const minutes = parseInt(btn.dataset.minutes);
      const s = getState();
      s.snoozedUntil = Date.now() + (minutes * 60 * 1000);
      saveState(s);
      document.getElementById('reminderBanner').style.display = 'none';
      document.getElementById('snoozeCard').style.display = 'none';

      // Schedule a re-check after snooze expires
      setTimeout(() => {
        showReminderBanner(getState());
        tryPushNotification();
      }, minutes * 60 * 1000);
    });
  });
}

// === Push Notifications ===
function tryPushNotification() {
  const state = getState();
  if (!state.reminderEnabled) return;

  const todayIdx = getTodayDayIndex();
  const isDone = state.completedDays[getDayKey(todayIdx)];
  if (isDone) return;

  if ('Notification' in window && Notification.permission === 'granted') {
    const portion = WEEKLY_PORTIONS[todayIdx];
    // Use service worker for notification (works when app is in background on iOS PWA)
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        title: 'שער הביטחון - הגיע הזמן ללמוד!',
        body: `${portion.dayName} · ${portion.title}`,
      });
    } else {
      // Fallback: direct notification
      new Notification('שער הביטחון - הגיע הזמן ללמוד!', {
        body: `${portion.dayName} · ${portion.title}`,
        dir: 'rtl',
        lang: 'he',
        tag: 'daily-reminder',
        renotify: true
      });
    }
  }
}

// === Periodic Reminder Check ===
// Runs every minute while app is open; checks if it's reminder time
function startReminderChecker() {
  // Check immediately on load
  checkReminderTime();

  // Then check every 60 seconds
  setInterval(checkReminderTime, 60 * 1000);
}

function checkReminderTime() {
  const state = getState();
  if (!state.reminderEnabled) return;

  const now = new Date();
  const currentH = now.getHours();
  const currentM = now.getMinutes();

  const todayIdx = getTodayDayIndex();
  const isDone = state.completedDays[getDayKey(todayIdx)];
  if (isDone) return;

  // Check if it's past the reminder time and we haven't notified yet today
  const reminderMinutes = state.reminderHour * 60 + state.reminderMinute;
  const currentMinutes = currentH * 60 + currentM;
  const today = getDateString();

  if (currentMinutes >= reminderMinutes && state.lastNotifiedDate !== today) {
    // Mark that we notified today
    state.lastNotifiedDate = today;
    saveState(state);

    tryPushNotification();
    showReminderBanner(state);
  }
}

// === Visibility Change Handler ===
// Re-check when user comes back to app (iOS suspends timers in background)
function setupVisibilityHandler() {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      renderAll();
      checkReminderTime();
      showReminderBanner(getState());
    }
  });
}

// === Reminders Setup ===
async function setupReminder() {
  const toggle = document.getElementById('reminderToggle');
  const timeSection = document.getElementById('reminderTimeSection');
  const statusEl = document.getElementById('reminderStatus');
  const infoEl = document.getElementById('reminderInfo');
  const state = getState();

  toggle.checked = state.reminderEnabled;
  timeSection.style.display = state.reminderEnabled ? 'flex' : 'none';

  if (state.reminderEnabled) {
    const h = String(state.reminderHour).padStart(2, '0');
    const m = String(state.reminderMinute).padStart(2, '0');
    document.getElementById('reminderTime').value = `${h}:${m}`;
    statusEl.textContent = `תזכורת מוגדרת לשעה ${h}:${m}`;
  }

  // Detect iOS and show tip
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone;
  if (isIOS && !isStandalone) {
    infoEl.style.display = 'block';
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
          showReminderBanner(s);
        } else if (perm === 'denied') {
          toggle.checked = false;
          statusEl.textContent = 'ההתראות חסומות. שנה בהגדרות הדפדפן.';
        } else {
          // "default" - still enable visual reminders
          timeSection.style.display = 'flex';
          const s = getState();
          s.reminderEnabled = true;
          saveState(s);
          statusEl.textContent = 'תזכורת ויזואלית מופעלת (ללא התראות מערכת).';
          showReminderBanner(s);
        }
      } else {
        // No Notification API - still enable visual banner reminders
        timeSection.style.display = 'flex';
        const s = getState();
        s.reminderEnabled = true;
        saveState(s);
        statusEl.textContent = 'תזכורת ויזואלית מופעלת.';
        showReminderBanner(s);
      }
    } else {
      timeSection.style.display = 'none';
      const s = getState();
      s.reminderEnabled = false;
      saveState(s);
      statusEl.textContent = 'תזכורת כבויה.';
      document.getElementById('reminderBanner').style.display = 'none';
      document.getElementById('snoozeCard').style.display = 'none';
    }
  });

  document.getElementById('saveReminder').addEventListener('click', () => {
    const time = document.getElementById('reminderTime').value;
    const [h, m] = time.split(':').map(Number);
    const s = getState();
    s.reminderHour = h;
    s.reminderMinute = m;
    s.reminderEnabled = true;
    s.lastNotifiedDate = null; // Reset so it can fire today if needed
    saveState(s);

    // Schedule via service worker
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        hour: h,
        minute: m
      });
    }

    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    statusEl.textContent = `תזכורת נשמרה לשעה ${timeStr}`;

    // Check immediately if we're past the time
    checkReminderTime();
    showReminderBanner(getState());
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

// === Text Reader ===
let currentReaderDay = null;
let readerFontSize = 1.15;

async function openReader(dayIndex) {
  currentReaderDay = dayIndex;
  const portion = WEEKLY_PORTIONS[dayIndex];
  const overlay = document.getElementById('readerOverlay');
  const title = document.getElementById('readerTitle');
  const loading = document.getElementById('readerLoading');
  const error = document.getElementById('readerError');
  const textEl = document.getElementById('readerText');

  title.textContent = `${portion.dayName} · ${portion.title}`;
  document.getElementById('readerSefariaLink').href = portion.sefariaUrl;
  document.getElementById('fallbackSefariaLink').href = portion.sefariaUrl;

  // Reset state
  loading.style.display = 'block';
  error.style.display = 'none';
  textEl.style.display = 'none';
  textEl.innerHTML = '';

  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  // Fetch text
  try {
    const texts = await fetchDayTexts(dayIndex);
    loading.style.display = 'none';

    if (!texts || texts.length === 0) {
      error.style.display = 'block';
      return;
    }

    // Render segments
    let html = '';
    texts.forEach((seg, i) => {
      // Clean HTML tags that Sefaria adds but keep basic formatting
      const cleaned = seg
        .replace(/<\/?(?:small|big|sup|sub)[^>]*>/gi, '')
        .replace(/<br\s*\/?>/gi, '<br>');
      html += `<div class="text-segment"><span class="seg-num">${i + 1}</span>${cleaned}</div>`;
    });

    textEl.innerHTML = html;
    textEl.style.display = 'block';
    textEl.style.fontSize = `${readerFontSize}rem`;
  } catch (err) {
    loading.style.display = 'none';
    error.style.display = 'block';
    console.error('Reader fetch error:', err);
  }
}

function closeReader() {
  document.getElementById('readerOverlay').style.display = 'none';
  document.body.style.overflow = '';
}

function setupReader() {
  // Open reader from today card
  document.getElementById('readTextBtn').addEventListener('click', () => {
    openReader(getTodayDayIndex());
  });

  // Close reader
  document.getElementById('closeReader').addEventListener('click', closeReader);

  // Font size controls
  document.getElementById('fontBigger').addEventListener('click', () => {
    readerFontSize = Math.min(readerFontSize + 0.15, 2.5);
    document.getElementById('readerText').style.fontSize = `${readerFontSize}rem`;
  });
  document.getElementById('fontSmaller').addEventListener('click', () => {
    readerFontSize = Math.max(readerFontSize - 0.15, 0.7);
    document.getElementById('readerText').style.fontSize = `${readerFontSize}rem`;
  });

  // Retry fetch
  document.getElementById('retryFetch').addEventListener('click', () => {
    if (currentReaderDay !== null) openReader(currentReaderDay);
  });

  // Mark done from reader
  document.getElementById('readerMarkDone').addEventListener('click', () => {
    if (currentReaderDay !== null) {
      markDayComplete(currentReaderDay);
      closeReader();
    }
  });
}

// === iOS Install Guide ===
function showInstallGuide() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone;
  const dismissed = localStorage.getItem('install-guide-dismissed');

  // Show only on iOS Safari, not already installed, not dismissed
  if (isIOS && !isStandalone && !dismissed) {
    document.getElementById('installOverlay').style.display = 'flex';
  }

  document.getElementById('closeInstall').addEventListener('click', dismissInstallGuide);
  document.getElementById('installDismiss').addEventListener('click', dismissInstallGuide);
}

function dismissInstallGuide() {
  document.getElementById('installOverlay').style.display = 'none';
  if (document.getElementById('installDontShow').checked) {
    localStorage.setItem('install-guide-dismissed', 'true');
  }
}

// === Render All ===
function renderAll() {
  const state = getState();
  renderProgress(state);
  renderTodayCard(state);
  renderDaysList(state);
  renderStats(state);
  showReminderBanner(state);
}

// === Init ===
function init() {
  renderAll();
  setupReader();
  setupReminder();
  setupBanner();
  setupReset();
  setupVisibilityHandler();
  startReminderChecker();
  showInstallGuide();

  // Close detail overlay
  document.getElementById('closeDayDetail').addEventListener('click', closeDayDetail);
  document.getElementById('dayDetailOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDayDetail();
  });

  // Mark done from today card
  document.getElementById('markDoneBtn').addEventListener('click', () => {
    markDayComplete(getTodayDayIndex());
  });

  // Register service worker and force update check on every load so stale
  // cache-first SWs from older versions are replaced immediately.
  if ('serviceWorker' in navigator) {
    // When a new SW takes control, reload once so the page uses the new assets.
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });

    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('Service Worker registered');
        // Force a network check for a newer sw.js on every load.
        reg.update().catch(() => {});

        // If an update is found, the new SW installs then takes over via
        // skipWaiting + clients.claim, which triggers controllerchange above.
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener('statechange', () => {
            if (sw.state === 'installed' && navigator.serviceWorker.controller) {
              // Old caches will be purged in the new SW's activate handler.
              sw.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });

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
