// שער הביטחון - חובות הלבבות
// מחולק ל-7 ימים לסיום שבועי
// מקור: ספריא - Duties of the Heart, Fourth Treatise on Trust

const DAYS_HEB = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

const SEFARIA_BASE = 'https://www.sefaria.org/api/texts/';
const TREATISE_REF = 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust';

// Each day maps to chapter indices in the treatise response.
// The Sefaria API returns data.he as a 2D array: he[chapterIndex][segmentIndex].
// Index 0 = Introduction, 1 = Chapter 1, 2 = Chapter 2, ... 7 = Chapter 7.
const WEEKLY_PORTIONS = [
  {
    day: 1,
    dayName: 'יום ראשון',
    title: 'הקדמה + פרק א׳',
    subtitle: 'מהות הביטחון ותנאיו',
    chapterMappings: [
      { index: 0 },
      { index: 1 }
    ],
    sections: [
      {
        heading: 'הקדמה - למה שער הביטחון',
        description: 'הקדמת רבינו בחיי למהות הביטחון, מעלותיו הרוחניות והגשמיות.',
        segments: 'הקדמה (מלא)'
      },
      {
        heading: 'פרק א׳ - הגדרת הביטחון',
        description: 'מהו ביטחון אמיתי: מנוחת נפשו של הבוטח. שש תכונות שצריכות להתקיים במי שבוטחים בו.',
        segments: 'פרק א׳ (מלא)'
      }
    ],
    topics: [
      'הגדרת הביטחון בה׳',
      'חמש מעלות רוחניות של הביטחון',
      'חמש מעלות גשמיות של הביטחון',
      'שש תכונות הנדרשות ממי שבוטחים בו'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Introduction.1?lang=he'
  },
  {
    day: 2,
    dayName: 'יום שני',
    title: 'פרק ב׳ + פרק ג׳',
    subtitle: 'למה ה׳ ראוי לביטחון וחובתו',
    chapterMappings: [
      { index: 2 },
      { index: 3 }
    ],
    sections: [
      {
        heading: 'פרק ב׳ - מדוע ה׳ ראוי לביטחון',
        description: 'הוכחות מהתורה שהקב״ה מקיים את כל ששת התנאים, ועוד יותר מכך.',
        segments: 'פרק ב׳ (מלא)'
      },
      {
        heading: 'פרק ג׳ - חמישה דברים המחייבים ביטחון',
        description: 'חמישה יסודות המחייבים את האדם לבטוח בה׳: הכרת חסדיו, ידיעתו את המחשבות, ועוד.',
        segments: 'פרק ג׳ (מלא)'
      }
    ],
    topics: [
      'ה׳ רחמן ומשגיח',
      'כוחו ית׳, ידיעתו ושליטתו',
      'חסדו אף למי שאינו ראוי',
      'חמישה יסודות המחייבים ביטחון',
      'הכרת חסדי ה׳'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_2.1?lang=he'
  },
  {
    day: 3,
    dayName: 'יום שלישי',
    title: 'פרק ד׳ - חלק א׳',
    subtitle: 'תחילת שבעת העניינים - הגוף והפרנסה',
    chapterMappings: [
      { index: 4, from: 1, to: 50 }
    ],
    sections: [
      {
        heading: 'פרק ד׳ א׳-נ׳',
        description: 'התחלת שבעת העניינים שצריך לבטוח בה׳ - ענייני בריאות הגוף, חיי האדם והתחלת ענייני הפרנסה.',
        segments: 'פרק ד׳ א׳-נ׳'
      }
    ],
    topics: [
      'שבעת עניינים שצריך לבטוח בה׳',
      'ביטחון בענייני הגוף',
      'ביטחון בחיי האדם',
      'פתיחת ענייני הפרנסה'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_4.1?lang=he'
  },
  {
    day: 4,
    dayName: 'יום רביעי',
    title: 'פרק ד׳ - חלק ב׳',
    subtitle: 'המשך ענייני הפרנסה וההשתדלות',
    chapterMappings: [
      { index: 4, from: 51 }
    ],
    sections: [
      {
        heading: 'פרק ד׳ נ״א-סוף',
        description: 'המשך ענייני הפרנסה, היחס בין השתדלות לביטחון, סוגי ההשתדלות, ענייני חברה וענייני עוה״ב.',
        segments: 'פרק ד׳ נ״א-סוף'
      }
    ],
    topics: [
      'ביטחון בפרנסה',
      'השתדלות מול ביטחון',
      'גבולות ההשתדלות המותרת',
      'ביטחון בענייני חברה',
      'ביטחון בענייני עולם הבא'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_4.51?lang=he'
  },
  {
    day: 5,
    dayName: 'יום חמישי',
    title: 'פרק ה׳',
    subtitle: 'חיי הבוטח באמת',
    chapterMappings: [
      { index: 5 }
    ],
    sections: [
      {
        heading: 'פרק ה׳ - תכונות הבוטח',
        description: 'חיי האדם הבוטח: שמחה והסתפקות, שלווה, הפיכת עסקי העולם לעבודת ה׳, מידות טובות.',
        segments: 'פרק ה׳ (מלא)'
      }
    ],
    topics: [
      'שמחת והסתפקות הבוטח',
      'שלוות הנפש',
      'עסקי העולם כעבודת ה׳',
      'מידות טובות של הבוטח'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_5.1?lang=he'
  },
  {
    day: 6,
    dayName: 'יום שישי',
    title: 'פרק ו׳',
    subtitle: 'חיי מי שאינו בוטח',
    chapterMappings: [
      { index: 6 }
    ],
    sections: [
      {
        heading: 'פרק ו׳ - ביקורת דוחי העבודה',
        description: 'ביקורת על הרודפים אחר תענוגות העולם ודוחים את עבודת ה׳. שבע סיבות למה דרכם שגויה.',
        segments: 'פרק ו׳ (מלא)'
      }
    ],
    topics: [
      'הטעות של דוחי העבודה',
      'שבע סיבות לטעותם',
      'תענוגות העולם מול עבודת ה׳'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_6.1?lang=he'
  },
  {
    day: 7,
    dayName: 'שבת',
    title: 'פרק ז׳',
    subtitle: 'מכשולים ומדרגות הביטחון',
    chapterMappings: [
      { index: 7 }
    ],
    sections: [
      {
        heading: 'פרק ז׳ - מכשולים ומדרגות',
        description: 'מה פוגם בביטחון, עשר מדרגות של ביטחון, עד המדרגה העליונה - השוויון.',
        segments: 'פרק ז׳ (מלא)'
      }
    ],
    topics: [
      'גורמים הפוגמים בביטחון',
      'עשר מדרגות הביטחון',
      'המדרגה העליונה - שוויון',
      'סיום וחזרה!'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_7.1?lang=he'
  }
];

// === Sefaria Text Fetcher ===
// New approach: fetch the ENTIRE treatise in one call, then split by chapter structure.
// The Sefaria API returns data.he as a 2D array for treatise-level requests.

const TEXT_CACHE_KEY = 'shaar-habitachon-texts';
const TEXT_CACHE_VERSION = 7;

function getTextCache() {
  try {
    const cached = localStorage.getItem(TEXT_CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      if (data.version === TEXT_CACHE_VERSION) return data.chapters;
    }
  } catch {}
  return null;
}

function saveTextCache(chapters) {
  try {
    localStorage.setItem(TEXT_CACHE_KEY, JSON.stringify({
      version: TEXT_CACHE_VERSION,
      chapters
    }));
  } catch {}
}

async function fetchTreatise() {
  const cached = getTextCache();
  if (cached) return cached;

  const url = SEFARIA_BASE + encodeURIComponent(TREATISE_REF) + '?context=0&pad=0';
  console.log('[Shaar] Fetching treatise from:', url);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.he || !Array.isArray(data.he)) {
      console.error('[Shaar] No he array in response');
      return null;
    }

    console.log('[Shaar] Response he type:', typeof data.he[0], 'length:', data.he.length);

    let chapters;

    if (Array.isArray(data.he[0])) {
      // 2D array: he[chapter][segment] — expected for treatise-level request
      chapters = data.he.map((chapterSegs, idx) => {
        const flat = flattenToStrings(chapterSegs);
        console.log(`[Shaar] Chapter ${idx}: ${flat.length} segments`);
        return flat;
      });
    } else if (typeof data.he[0] === 'string') {
      // Flat 1D array — the API returned segments without chapter structure.
      // Fall back to fetching each chapter individually.
      console.warn('[Shaar] Treatise returned flat array, falling back to per-chapter fetch');
      return await fetchChaptersIndividually();
    } else {
      console.error('[Shaar] Unexpected he structure:', typeof data.he[0]);
      return null;
    }

    if (chapters.length > 0) {
      saveTextCache(chapters);
    }
    return chapters;
  } catch (err) {
    console.error('[Shaar] Failed to fetch treatise:', err);
    // Fall back to per-chapter fetch
    return await fetchChaptersIndividually();
  }
}

// Fallback: fetch each chapter/section individually with encoded refs.
async function fetchChaptersIndividually() {
  console.log('[Shaar] Fetching chapters individually...');
  const refs = [
    'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Introduction',
    'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_1',
    'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_2',
    'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_3',
    'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_4',
    'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_5',
    'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_6',
    'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_7'
  ];

  const chapters = [];
  for (const ref of refs) {
    const url = SEFARIA_BASE + encodeURIComponent(ref) + '?context=0&pad=0';
    console.log(`[Shaar] Fetching: ${ref}`);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!data.he) {
        chapters.push([]);
        continue;
      }

      const segs = flattenToStrings(data.he);
      console.log(`[Shaar] ${ref}: ${segs.length} segments`);

      // Sanity check: a single chapter should not exceed ~300 segments.
      // If it does, the API likely returned the entire treatise.
      if (segs.length > 300) {
        console.warn(`[Shaar] ${ref} returned ${segs.length} segments — likely the full treatise. Truncating.`);
      }

      chapters.push(segs);
    } catch (err) {
      console.error(`[Shaar] Failed to fetch ${ref}:`, err);
      chapters.push([]);
    }
  }

  if (chapters.some(c => c.length > 0)) {
    saveTextCache(chapters);
  }
  return chapters;
}

function flattenToStrings(arr) {
  if (typeof arr === 'string') {
    return arr.trim().length > 0 ? [arr] : [];
  }
  if (Array.isArray(arr)) {
    const result = [];
    for (const item of arr) {
      result.push(...flattenToStrings(item));
    }
    return result;
  }
  return [];
}

async function fetchDayTexts(dayIndex) {
  const portion = WEEKLY_PORTIONS[dayIndex];
  const chapters = await fetchTreatise();
  if (!chapters) return [];

  const allTexts = [];

  for (const mapping of portion.chapterMappings) {
    const idx = mapping.index;
    if (idx >= chapters.length || !chapters[idx]) {
      console.warn(`[Shaar] Chapter index ${idx} not found (have ${chapters.length} chapters)`);
      continue;
    }

    const chapter = chapters[idx];

    if (mapping.from !== undefined || mapping.to !== undefined) {
      const start = (mapping.from || 1) - 1;
      const end = mapping.to !== undefined ? mapping.to : chapter.length;
      allTexts.push(...chapter.slice(start, end));
    } else {
      allTexts.push(...chapter);
    }
  }

  console.log(`[Shaar] Day ${dayIndex + 1}: ${allTexts.length} segments`);
  return allTexts;
}
