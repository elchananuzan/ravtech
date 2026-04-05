// שער הביטחון - חובות הלבבות
// מחולק ל-7 ימים לסיום שבועי
// מקור: ספריא - Duties of the Heart, Fourth Treatise on Trust

const DAYS_HEB = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

const WEEKLY_PORTIONS = [
  {
    day: 1,
    dayName: 'יום ראשון',
    title: 'הקדמה - חלק א׳',
    subtitle: 'מהות הביטחון ומעלותיו',
    sefariaRef: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Introduction.1-23',
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
    sefariaRef: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Introduction.24-46',
    sections: [
      {
        heading: 'סיום ההקדמה',
        description: 'המשך ההקדמה - תיאור שבעת פרקי השער ותוכנם.',
        segments: 'הקדמה כ״ד-מ״ו'
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
    title: 'פרקים ב׳-ג׳',
    subtitle: 'מדוע ה׳ ראוי לביטחון וחובת הביטחון',
    sefariaRef: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_2-3',
    sections: [
      {
        heading: 'פרק ב׳ - שבע תכונות שבהן ה׳ ראוי לביטחון',
        description: 'הוכחות מהתורה שהקב״ה מקיים את כל ששת התנאים שנמנו בפרק א׳, ועוד יותר מכך.',
        segments: 'פרק ב׳'
      },
      {
        heading: 'פרק ג׳ - חמישה דברים המחייבים ביטחון בה׳',
        description: 'חמישה יסודות: הכרת חסדי ה׳, ידיעתו את מחשבותינו, ביטחון אמיתי, שילוב אמונה עם עבודה, והשתדלות מול ביטחון.',
        segments: 'פרק ג׳'
      }
    ],
    topics: [
      'ה׳ רחמן ומשגיח',
      'כוחו ית׳ וידיעתו',
      'שליטתו המוחלטת',
      'חסדו אף למי שאינו ראוי',
      'חמישה יסודות המחייבים ביטחון'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_2.1?lang=he'
  },
  {
    day: 4,
    dayName: 'יום רביעי',
    title: 'פרק ד׳ - חלק א׳',
    subtitle: 'שבעה עניינים שצריך לבטוח בה׳ - ענייני עוה״ז',
    sefariaRef: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_4.1-45',
    sections: [
      {
        heading: 'ענייני הגוף והפרנסה',
        description: 'ביטחון בענייני בריאות הגוף, פרנסה ועניינים גשמיים. דיון מעמיק ביחס בין השתדלות לביטחון.',
        segments: 'פרק ד׳ א׳-מ״ה'
      }
    ],
    topics: [
      'ביטחון בענייני הגוף',
      'ביטחון בפרנסה',
      'ביטחון בענייני משפחה',
      'היחס בין השתדלות לביטחון',
      'סוגי ההשתדלות המותרים'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_4.1?lang=he'
  },
  {
    day: 5,
    dayName: 'יום חמישי',
    title: 'פרק ד׳ - חלק ב׳',
    subtitle: 'המשך שבעת העניינים - ענייני עוה״ב והשתדלות',
    sefariaRef: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_4.46-99',
    sections: [
      {
        heading: 'ענייני עולם הבא והשתדלות',
        description: 'ביטחון בענייני חברה, אמונה במצוות, שכר ועונש, הכרת חסדי ה׳. דיון נרחב בהשתדלות מול ביטחון.',
        segments: 'פרק ד׳ מ״ו-צ״ט'
      }
    ],
    topics: [
      'ביטחון בענייני חברה',
      'אמונה בתוך קיום המצוות',
      'שכר ועונש צודק',
      'הכרת נדיבות ה׳',
      'גבולות ההשתדלות',
      'מתי להרבות ומתי למעט בהשתדלות'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_4.46?lang=he'
  },
  {
    day: 6,
    dayName: 'יום שישי',
    title: 'פרקים ה׳-ו׳',
    subtitle: 'חיי הבוטח מול חיי מי שאינו בוטח',
    sefariaRef: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_5-6',
    sections: [
      {
        heading: 'פרק ה׳ - שבע תכונות של הבוטח בה׳',
        description: 'חיי האדם שבוטח באמת: שמחה והסתפקות, שלווה, הפיכת עסקי העולם לעבודת ה׳, מידות טובות ויחסים טובים.',
        segments: 'פרק ה׳'
      },
      {
        heading: 'פרק ו׳ - חיי מי שאינו בוטח',
        description: 'ביקורת על הרודפים אחר תענוגות העולם ודוחים את עבודת ה׳. שבע סיבות למה דרכם שגויה.',
        segments: 'פרק ו׳'
      }
    ],
    topics: [
      'הסתפקות ושמחה',
      'שלוות הנפש',
      'עסקי העולם כעבודת ה׳',
      'מידות טובות ויחסי אנוש',
      'חיים ברגע הנוכחי',
      'הטעות של דחיית עבודת ה׳',
      'שבע סיבות לטעותם'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_5.1?lang=he'
  },
  {
    day: 7,
    dayName: 'שבת',
    title: 'פרק ז׳',
    subtitle: 'מכשולים בביטחון ועשר מדרגות הביטחון',
    sefariaRef: 'Duties_of_the_Heart,_Fourth_Treatise_on_Trust,_Chapter_7',
    sections: [
      {
        heading: 'פרק ז׳ - מכשולים ומדרגות',
        description: 'מה פוגם בביטחון: בורות בענייני ה׳, התורה והעולם. עשר מדרגות של ביטחון, עד המדרגה העליונה - השוויון.',
        segments: 'פרק ז׳'
      }
    ],
    topics: [
      'גורמים הפוגמים בביטחון',
      'בורות כמכשול',
      'עשר מדרגות הביטחון',
      'המדרגה העליונה - שוויון',
      'לעולם לא לרצות להיות במצב אחר',
      'סיום וחזרה!'
    ],
    sefariaUrl: 'https://www.sefaria.org/Duties_of_the_Heart%2C_Fourth_Treatise_on_Trust%2C_Chapter_7.1?lang=he'
  }
];
