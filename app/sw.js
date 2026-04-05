const CACHE_NAME = 'shaar-habitachon-v2';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './content.js',
  './manifest.json'
];

// Install - cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Message handler for notifications
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    scheduleDaily(event.data.hour, event.data.minute);
  }
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: 'icons/icon-192.png',
      dir: 'rtl',
      lang: 'he',
      tag: 'daily-reminder',
      renotify: true,
      actions: [
        { action: 'open', title: 'פתח ולמד' },
        { action: 'snooze', title: 'הזכר לי אח״כ' }
      ]
    });
  }
});

function scheduleDaily(hour, minute) {
  const now = new Date();
  let next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  const delay = next - now;

  setTimeout(() => {
    self.registration.showNotification('שער הביטחון - לימוד יומי', {
      body: getNotificationBody(),
      icon: 'icons/icon-192.png',
      dir: 'rtl',
      lang: 'he',
      tag: 'daily-reminder',
      renotify: true
    });
    // Reschedule for next day
    scheduleDaily(hour, minute);
  }, delay);
}

function getNotificationBody() {
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const today = new Date().getDay();
  return `היום יום ${days[today]} - הגיע הזמן ללמוד את החלק היומי! 📖`;
}

// Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'snooze') {
    // Snooze: re-notify in 30 minutes
    setTimeout(() => {
      self.registration.showNotification('שער הביטחון - תזכורת!', {
        body: getNotificationBody(),
        icon: 'icons/icon-192.png',
        dir: 'rtl',
        lang: 'he',
        tag: 'daily-reminder',
        renotify: true
      });
    }, 30 * 60 * 1000);
    return;
  }

  // Default: open the app
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow('./');
    })
  );
});
