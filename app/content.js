// שער הביטחון - חובות הלבבות
// מחולק ל-7 ימים לסיום שבועי
// מקור: ספריא - Duties of the Heart, Fourth Treatise on Trust

const DAYS_HEB = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

const SEFARIA_BASE = 'https://www.sefaria.org/api/texts/';

// Sefaria API references for each day's portion.
// Each entry is { ref, from?, to? }:
//   - ref: Sefaria reference string (fetched as full chapter)
//   - from/to: 1-based segment range to slice locally (inclusive)
//   If from/to omitted, the entire chapter is used.
const WEEKLY_PORTIONS = [
  {
    day: 1,
    dayName: 'יום ראשון',
    title: 'הקדמה + פרק א׳',
    subtitle: 'מהות הביטחון ותנאיו',
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Introduction' },
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_1' }
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
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_2' },
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_3' }
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
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_4', from: 1, to: 50 }
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
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_4', from: 51 }
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
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_5' }
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
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_6' }
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
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_7' }
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
const TEXT_CACHE_KEY = 'shaar-habitachon-texts';
const TEXT_CACHE_VERSION = 5; // bumped after full weekly restructure

function getTextCache() {
  try {
    const cached = localStorage.getItem(TEXT_CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      if (data.version === TEXT_CACHE_VERSION) return data.texts;
    }
  } catch {}
  return {};
}

function saveTextCache(texts) {
  try {
    localStorage.setItem(TEXT_CACHE_KEY, JSON.stringify({
      version: TEXT_CACHE_VERSION,
      texts
    }));
  } catch {}
}

// Fetches a full Sefaria chapter (all segments) as a flat array of Hebrew strings.
async function fetchSefariaChapter(ref) {
  const cache = getTextCache();
  if (cache[ref]) return cache[ref];

  // Sefaria v2 API - returns { he: [...], text: [...] }
  const url = SEFARIA_BASE + ref + '?context=0&pad=0';
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    let heTexts = [];
    if (data.he) {
      heTexts = flattenText(data.he);
    }

    // Do NOT filter empty strings here - we need to preserve indices for slicing.
    if (heTexts.length > 0) {
      cache[ref] = heTexts;
      saveTextCache(cache);
    }
    return heTexts;
  } catch (err) {
    console.error(`Failed to fetch ${ref}:`, err);
    return null;
  }
}

function flattenText(text) {
  if (typeof text === 'string') return [text];
  if (Array.isArray(text)) {
    const result = [];
    for (const item of text) {
      if (typeof item === 'string') {
        result.push(item);
      } else if (Array.isArray(item)) {
        result.push(...flattenText(item));
      }
    }
    return result;
  }
  return [];
}

// Fetch all texts for a given day, slicing ranges locally from the full chapter.
async function fetchDayTexts(dayIndex) {
  const portion = WEEKLY_PORTIONS[dayIndex];
  const allTexts = [];

  for (const entry of portion.sefariaRefs) {
    // Support both old-style strings and new-style { ref, from, to } objects.
    const ref = typeof entry === 'string' ? entry : entry.ref;
    const from = typeof entry === 'object' ? entry.from : undefined;
    const to = typeof entry === 'object' ? entry.to : undefined;

    const chapter = await fetchSefariaChapter(ref);
    if (!chapter) continue;

    let slice;
    if (from !== undefined || to !== undefined) {
      const start = (from || 1) - 1; // 1-based → 0-based
      const end = to !== undefined ? to : chapter.length;
      slice = chapter.slice(start, end);
    } else {
      slice = chapter;
    }

    // Filter empties only after slicing so ranges stay aligned.
    slice = slice.filter(t => t && t.trim && t.trim().length > 0);
    allTexts.push(...slice);
  }

  return allTexts;
}
