import type { Translation } from '../i18n';

/** Mood, tablet, water, food, yoga, seasonal tips, help card. */
export const wellnessStrings = {
  'well.title': { en: 'Wellness', hinglish: 'Sehat' },
  'well.subtitle': {
    en: 'Small, kind habits for you and baby',
    hinglish: 'Aapke aur baby ke liye chhoti pyaari aadatein',
  },
  'well.doctorNote': {
    en: 'Please check with your doctor.',
    hinglish: 'Kripya apne doctor se salaah lein.',
  },

  // Care row (Today)
  'care.title': { en: 'Little care', hinglish: 'Chhoti dekhbhaal' },
  'care.tablet': { en: 'Tablet', hinglish: 'Tablet' },
  'care.water': { en: 'Water', hinglish: 'Paani' },
  'care.mood': { en: 'Mood', hinglish: 'Mann' },
  'care.kicks': { en: 'Kicks', hinglish: 'Laatein' },

  // Mood
  'mood.title': { en: 'How are you feeling?', hinglish: 'Aaj mann kaisa hai?' },
  'mood.1': { en: 'Very low', hinglish: 'Bahut udaas' },
  'mood.2': { en: 'Low', hinglish: 'Thoda udaas' },
  'mood.3': { en: 'Okay', hinglish: 'Theek' },
  'mood.4': { en: 'Good', hinglish: 'Achha' },
  'mood.5': { en: 'Very happy', hinglish: 'Bahut khush' },
  'mood.note': {
    en: 'Want to add a note? (optional)',
    hinglish: 'Kuch likhna hai? (zaroori nahi)',
  },
  'mood.saveNote': { en: 'Save note', hinglish: 'Note save' },
  'mood.saved': { en: 'Thank you for checking in 💛', hinglish: 'Apna haal batane ka shukriya 💛' },
  'mood.week': { en: 'This week', hinglish: 'Is hafte' },
  'mood.lowTitle': {
    en: 'It’s been a heavy few days 💛',
    hinglish: 'Pichhle kuch din bhaari rahe 💛',
  },
  'mood.lowText': {
    en: 'Feeling low is common in pregnancy, and you don’t have to carry it alone. Talk to someone you trust in the family, and to your doctor. Tele-MANAS is a free, confidential helpline, any time of day.',
    hinglish:
      'Garbhavastha mein mann udaas hona aam hai, aur aapko akele nahi sehna. Parivaar mein kisi apne se aur doctor se baat kijiye. Tele-MANAS ek muft, gupt helpline hai, din-raat kabhi bhi.',
  },
  'mood.callTeleManas': { en: 'Call Tele-MANAS 14416', hinglish: 'Tele-MANAS ko call 14416' },

  // Tablet
  'tablet.title': { en: 'Iron / calcium tablet', hinglish: 'Iron / calcium tablet' },
  'tablet.why': {
    en: 'Anaemia is very common in pregnancy. Your daily tablet keeps you and baby strong.',
    hinglish:
      'Garbhavastha mein khoon ki kami bahut aam hai. Roz ki tablet aapko aur baby ko majboot rakhti hai.',
  },
  'tablet.take': { en: 'I took my tablet 💊', hinglish: 'Maine tablet li 💊' },
  'tablet.done': { en: 'Taken today ✓', hinglish: 'Aaj le li ✓' },
  'tablet.thanks': {
    en: 'Shabaash! A leaf for baby’s garden 🍃',
    hinglish: 'Shabaash! Baby ke bagiche mein ek patta 🍃',
  },

  // Water
  'water.title': { en: 'Water', hinglish: 'Paani' },
  'water.count': { en: '{count} of {goal} glasses', hinglish: '{count} / {goal} gilaas' },
  'water.add': { en: 'Add a glass of water', hinglish: 'Ek gilaas paani jodiye' },
  'water.remove': { en: 'Remove a glass', hinglish: 'Ek gilaas ghataaiye' },
  'water.summer': {
    en: 'It’s hot: aim for a few extra glasses, plus nimbu-pani or chaach.',
    hinglish: 'Garmi hai: kuch gilaas zyada, saath mein nimbu-pani ya chaach.',
  },
  'water.goalMet': {
    en: 'Goal reached! Ghani badhiya 💧',
    hinglish: 'Lakshya poora! Ghani badhiya 💧',
  },

  // Food / yoga / seasonal
  'food.title': { en: 'Haryanvi kitchen tips', hinglish: 'Haryanvi rasoi ki salaah' },
  'food.caution': { en: 'Gently', hinglish: 'Dhyaan se' },
  'yoga.title': {
    en: 'Yoga & pranayama for trimester {tri}',
    hinglish: 'Timahi {tri} ke liye yog aur pranayam',
  },
  'yoga.note': {
    en: 'Only with your doctor’s approval. Stop if anything hurts or you feel dizzy.',
    hinglish: 'Sirf doctor ki salaah se. Dard ya chakkar ho to turant rukiye.',
  },
  'yoga.done': { en: 'I did a little yoga 🧘', hinglish: 'Maine thoda yog kiya 🧘' },

  // Help
  'help.title': { en: 'Help', hinglish: 'Madad' },
  'help.emergency': { en: 'Emergency numbers', hinglish: 'Emergency number' },
  'help.ambulance': {
    en: '108 · Ambulance (free in Haryana)',
    hinglish: '108 · Ambulance (Haryana mein muft)',
  },
  'help.health': { en: '104 · Health helpline', hinglish: '104 · Swasthya helpline' },
  'help.telemanas': {
    en: '14416 · Tele-MANAS (mental health)',
    hinglish: '14416 · Tele-MANAS (mann ki sehat)',
  },
  'help.myContacts': { en: 'My doctor and hospital', hinglish: 'Mere doctor aur hospital' },
  'help.doctorName': { en: 'Doctor’s name', hinglish: 'Doctor ka naam' },
  'help.doctorPhone': { en: 'Doctor’s phone', hinglish: 'Doctor ka phone' },
  'help.hospitalName': { en: 'Nearest hospital', hinglish: 'Sabse paas ka hospital' },
  'help.hospitalPhone': { en: 'Hospital phone', hinglish: 'Hospital ka phone' },
  'help.call': { en: 'Call {name}', hinglish: '{name} ko call' },
  'help.save': { en: 'Save', hinglish: 'Save' },
  'help.saved': { en: 'Saved 💛', hinglish: 'Save ho gaya 💛' },
  'help.dangerTitle': {
    en: 'Call your doctor right away if you notice:',
    hinglish: 'Inmein se kuch bhi ho to turant doctor ko call kijiye:',
  },
  'help.danger.bleeding': {
    en: 'Any bleeding from the vagina',
    hinglish: 'Yoni se koi bhi khoon aana',
  },
  'help.danger.headache': {
    en: 'Severe headache, or blurred vision',
    hinglish: 'Tez sir dard, ya dhundhla dikhna',
  },
  'help.danger.swelling': {
    en: 'Sudden swelling of the face or hands',
    hinglish: 'Chehre ya haathon par achaanak soojan',
  },
  'help.danger.movements': {
    en: 'Baby moving less than usual',
    hinglish: 'Baby ki harkat roz se kam',
  },
  'help.danger.fluid': { en: 'Fluid leaking from the vagina', hinglish: 'Yoni se paani risna' },
  'help.danger.fever': { en: 'High fever', hinglish: 'Tez bukhaar' },
  'help.danger.pain': { en: 'Severe pain in the tummy', hinglish: 'Pet mein tez dard' },
  'help.calmNote': {
    en: 'Stay calm, sit or lie on your left side, and call. It’s always okay to check.',
    hinglish:
      'Shaant rahiye, baayein karvat baithiye ya letiye, aur call kijiye. Poochh lena hamesha theek hai.',
  },
} satisfies Record<string, Translation>;
