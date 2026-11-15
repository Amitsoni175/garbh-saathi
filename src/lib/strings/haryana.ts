import type { Translation } from '../i18n';

/** Festivals, Godh Bharai, after-birth placeholder. */
export const haryanaStrings = {
  'fest.today': { en: 'Today! 🎉', hinglish: 'Aaj hai! 🎉' },
  'fest.tomorrow': { en: 'Tomorrow', hinglish: 'Kal' },
  'fest.inDays': { en: 'In {days} days', hinglish: '{days} din mein' },
  'fest.list': { en: 'Haryana festivals', hinglish: 'Haryana ke tyohaar' },
  'fest.listNote': {
    en: 'Dates follow the lunar calendar and change every year. Please check them with a panchang.',
    hinglish:
      'Taareekhein panchang ke hisaab se har saal badalti hain. Kripya panchang se mila lijiye.',
  },
  'fest.date': { en: '{date}', hinglish: '{date}' },
  'fest.notFound': {
    en: 'This festival isn’t in the calendar yet.',
    hinglish: 'Yeh tyohaar abhi calendar mein nahi hai.',
  },
  'fest.swing': { en: 'Teej swing', hinglish: 'Teej ka jhoola' },
  'fest.song': { en: 'Sing the Teej song 🌿', hinglish: 'Teej ka geet gaaiye 🌿' },
  'fest.careNote': { en: 'A gentle note', hinglish: 'Ek pyaari salaah' },
  'fest.open': { en: 'Open', hinglish: 'Kholiye' },

  'godh.title': { en: 'Godh Bharai memories', hinglish: 'Godh Bharai ki yaadein' },
  'godh.intro': {
    en: 'Godh Bharai fills the mother’s lap with blessings, fruit and love. Keep the photos and the sweet words from your family here.',
    hinglish:
      'Godh Bharai mein maa ki god aashirvaad, phal aur pyaar se bhari jaati hai. Parivaar ki photo aur pyaari baatein yahan sambhaal kar rakhiye.',
  },
  'godh.addPhoto': { en: 'Add a photo 📷', hinglish: 'Photo jodiye 📷' },
  'godh.notePlaceholder': {
    en: 'Who came, what they said, what you felt…',
    hinglish: 'Kaun aaya, kisne kya kaha, aapko kaisa laga…',
  },
  'godh.saveNote': { en: 'Save memory 💛', hinglish: 'Yaad save 💛' },
  'godh.saved': { en: 'Memory saved 💛', hinglish: 'Yaad save ho gayi 💛' },
  'godh.addEvent': {
    en: 'Add the Godh Bharai date to the calendar',
    hinglish: 'Godh Bharai ki date calendar mein jodiye',
  },

  'after.title': { en: 'Welcome, little one! 🎉', hinglish: 'Swagat hai, nanhe mehmaan! 🎉' },
  'after.text': {
    en: 'Congratulations to the whole family! Rest, heal, and enjoy these first days. Your garden, letters and recordings are all safe here.',
    hinglish:
      'Poore parivaar ko badhaai! Aaraam kijiye, sehat sambhaaliye, aur in pehle dino ka anand lijiye. Aapka bagicha, chitthiyan aur recordings sab yahan surakshit hain.',
  },
  'after.coming': { en: 'Coming soon', hinglish: 'Jaldi aa raha hai' },
  'after.list': {
    en: 'Kuan Pujan · Chhuchhak · Namkaran · lullabies for the first months',
    hinglish: 'Kuan Pujan · Chhuchhak · Namkaran · pehle mahino ki loriyan',
  },
  'after.loris': { en: 'Loris for baby', hinglish: 'Baby ke liye loriyan' },
  'after.letters': { en: 'Read your letters', hinglish: 'Apni chitthiyan padhiye' },
  'after.mark': { en: 'Yes, baby is here', hinglish: 'Haan, baby aa gaya' },
  'after.marked': { en: 'Badhaai ho! 💛', hinglish: 'Badhaai ho! 💛' },
  'after.doctor': {
    en: 'For any worry about you or baby, call your doctor or 108.',
    hinglish: 'Aapki ya baby ki koi bhi chinta ho to doctor ya 108 ko call kijiye.',
  },
} satisfies Record<string, Translation>;
