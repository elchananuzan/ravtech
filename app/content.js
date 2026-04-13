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
    title: 'הקדמה - חלק א׳',
    subtitle: 'מהות הביטחון ומעלותיו',
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Introduction', from: 1, to: 23 }
    ],
    sections: [
      {
        heading: 'פתיחה - למה שער הביטחון',
        description: 'הקדמת רבינו בחיי למהות הביטחון, מדוע בא שער זה אחרי שער עבודת האלוקים, והגדרת הביטחון.',
        segments: 'הקדמה א׳-כ״ג'
      }
    ],
    topics: [
      'הגדרת הביטחון בה׳',
      'חמש מעלות רוחניות של הביטחון',
      'חמש מעלות גשמיות של הביטחון',
      'מנוחת הנפש של הבוטח'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Introduction.1?lang=he'
  },
  {
    day: 2,
    dayName: 'יום שני',
    title: 'הקדמה חלק ב׳ + פרק א׳',
    subtitle: 'תנאי הביטחון והגדרתו',
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Introduction', from: 24 },
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_1' }
    ],
    sections: [
      {
        heading: 'סיום ההקדמה',
        description: 'המשך ההקדמה - תיאור שבעת פרקי השער ותוכנם.',
        segments: 'הקדמה כ״ד-סוף'
      },
      {
        heading: 'פרק א׳ - הגדרת הביטחון',
        description: 'מהו ביטחון אמיתי: מנוחת נפשו של הבוטח. ששה תנאים שצריכים להתקיים במי שבוטחים בו.',
        segments: 'פרק א׳'
      }
    ],
    topics: [
      'תיאור שבעת הפרקים',
      'הגדרת הביטחון - מנוחת הנפש',
      'שש תכונות הנדרשות ממי שבוטחים בו',
      'רחמנות, השגחה, כוח, ידיעה, שליטה, וחסד'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Introduction.24?lang=he'
  },
  {
    day: 3,
    dayName: 'יום שלישי',
    title: 'פרק ב׳',
    subtitle: 'שבע תכונות שבהן ה׳ ראוי לביטחון',
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_2' }
    ],
    sections: [
      {
        heading: 'פרק ב׳ - מדוע ה׳ ראוי לביטחון',
        description: 'הוכחות מהתורה שהקב״ה מקיים את כל ששת התנאים שנמנו בפרק א׳, ועוד יותר מכך.',
        segments: 'פרק ב׳ (מלא)'
      }
    ],
    topics: [
      'ה׳ רחמן ומשגיח',
      'כוחו ית׳ וידיעתו',
      'שליטתו המוחלטת',
      'חסדו אף למי שאינו ראוי',
      'הסיבה העליונה לכל דבר'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_2.1?lang=he'
  },
  {
    day: 4,
    dayName: 'יום רביעי',
    title: 'פרק ג׳ + תחילת פרק ד׳',
    subtitle: 'חובת הביטחון ופתיחת שבעת העניינים',
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_3' },
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_4', from: 1, to: 25 }
    ],
    sections: [
      {
        heading: 'פרק ג׳ - חמישה דברים המחייבים ביטחון בה׳',
        description: 'חמישה יסודות: הכרת חסדי ה׳, ידיעתו את מחשבותינו, ביטחון אמיתי, שילוב אמונה עם עבודה, והשתדלות מול ביטחון.',
        segments: 'פרק ג׳ (מלא)'
      },
      {
        heading: 'פתיחת פרק ד׳ - ענייני הגוף',
        description: 'התחלת שבעת העניינים שצריך לבטוח בה׳ - ביטחון בענייני בריאות הגוף וחיי האדם.',
        segments: 'פרק ד׳ א׳-כ״ה'
      }
    ],
    topics: [
      'חמישה יסודות המחייבים ביטחון',
      'הכרת חסדי ה׳',
      'ידיעתו את המחשבות',
      'פתיחת שבעת העניינים',
      'ביטחון בענייני הגוף'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_3.1?lang=he'
  },
  {
    day: 5,
    dayName: 'יום חמישי',
    title: 'פרק ד׳ - חלק ב׳',
    subtitle: 'המשך ענייני הגוף והפרנסה',
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_4', from: 26, to: 60 }
    ],
    sections: [
      {
        heading: 'פרנסה והשתדלות',
        description: 'ביטחון בפרנסה, היחס בין השתדלות לביטחון, וסוגי ההשתדלות המותרים והאסורים.',
        segments: 'פרק ד׳ כ״ו-ס׳'
      }
    ],
    topics: [
      'ביטחון בפרנסה',
      'השתדלות מול ביטחון',
      'סוגי ההשתדלות המותרים',
      'גבולות הבקשה והתחבולה'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_4.26?lang=he'
  },
  {
    day: 6,
    dayName: 'יום שישי',
    title: 'סיום פרק ד׳ + פרק ה׳',
    subtitle: 'ענייני עוה״ב וחיי הבוטח',
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_4', from: 61 },
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_5' }
    ],
    sections: [
      {
        heading: 'סיום פרק ד׳ - ענייני עולם הבא',
        description: 'ביטחון בענייני חברה, אמונה במצוות, שכר ועונש, והכרת חסדי ה׳.',
        segments: 'פרק ד׳ ס״א-סוף'
      },
      {
        heading: 'פרק ה׳ - שבע תכונות של הבוטח',
        description: 'חיי האדם שבוטח באמת: שמחה והסתפקות, שלווה, הפיכת עסקי העולם לעבודת ה׳, מידות טובות.',
        segments: 'פרק ה׳ (מלא)'
      }
    ],
    topics: [
      'ביטחון בענייני חברה',
      'אמונה בקיום המצוות',
      'שכר ועונש צודק',
      'הסתפקות ושמחת הבוטח',
      'עסקי העולם כעבודת ה׳'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_4.61?lang=he'
  },
  {
    day: 7,
    dayName: 'שבת',
    title: 'פרקים ו׳-ז׳',
    subtitle: 'חיי שאינו בוטח + מכשולים ומדרגות',
    sefariaRefs: [
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_6' },
      { ref: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_7' }
    ],
    sections: [
      {
        heading: 'פרק ו׳ - חיי מי שאינו בוטח',
        description: 'ביקורת על הרודפים אחר תענוגות העולם ודוחים את עבודת ה׳. שבע סיבות למה דרכם שגויה.',
        segments: 'פרק ו׳ (מלא)'
      },
      {
        heading: 'פרק ז׳ - מכשולים ומדרגות הביטחון',
        description: 'מה פוגם בביטחון, עשר מדרגות של ביטחון, עד המדרגה העליונה - השוויון.',
        segments: 'פרק ז׳ (מלא)'
      }
    ],
    topics: [
      'הטעות של דוחי העבודה',
      'שבע סיבות לטעותם',
      'גורמים הפוגמים בביטחון',
      'עשר מדרגות הביטחון',
      'המדרגה העליונה - שוויון',
      'סיום וחזרה!'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_6.1?lang=he'
  }
];

// === Sefaria Text Fetcher ===
const TEXT_CACHE_KEY = 'shaar-habitachon-texts';
const TEXT_CACHE_VERSION = 4; // bumped after rebalancing day splits

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
