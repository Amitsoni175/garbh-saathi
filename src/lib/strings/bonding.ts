import type { Translation } from '../i18n';

/** Kick counter, journal (letters), papa corner, belly photos. */
export const bondingStrings = {
  // Kick counter
  'kick.title': { en: 'Kick counter', hinglish: 'Laatein ginna' },
  'kick.tap': { en: 'Tap for each kick', hinglish: 'Har laat par dabaaiye' },
  'kick.tapLabel': {
    en: 'Count a kick. {count} so far.',
    hinglish: 'Ek laat giniye. Ab tak {count}.',
  },
  'kick.of': { en: '{count} of 10', hinglish: '{count} / 10' },
  'kick.elapsed': { en: '{time} so far', hinglish: 'Ab tak {time}' },
  'kick.howTo': {
    en: 'Lie on your left side after a meal, relax, and tap each time you feel a movement (a kick, roll or flutter). Most babies reach 10 movements well within 2 hours.',
    hinglish:
      'Khaane ke baad baayein karvat let kar aaraam kijiye, aur har harkat (laat, ghoomna, phadphadahat) par dabaaiye. Zyaadatar baby 2 ghante se kaafi pehle 10 harkatein kar lete hain.',
  },
  'kick.saveNow': { en: 'Save this session', hinglish: 'Abhi save kijiye' },
  'kick.reset': { en: 'Start over', hinglish: 'Phir se' },
  'kick.done': { en: '10 kicks in {min} minutes 💛', hinglish: '{min} minute mein 10 laatein 💛' },
  'kick.saved': {
    en: 'Saved: {count} kicks in {min} min',
    hinglish: 'Save hua: {min} min mein {count} laatein',
  },
  'kick.history': { en: 'Minutes to reach 10 kicks', hinglish: '10 laaton tak ke minute' },
  'kick.historyEmpty': {
    en: 'Your sessions will appear here as a soft little chart.',
    hinglish: 'Aapke session yahan ek pyaare chart mein dikhenge.',
  },
  'kick.chartLabel': {
    en: 'Chart of your last {n} kick count sessions',
    hinglish: 'Pichhle {n} session ka chart',
  },
  'kick.safety': {
    en: 'If you notice fewer movements than usual, contact your doctor right away. Don’t wait until the next day.',
    hinglish:
      'Agar harkatein roz se kam lagein, to turant doctor se sampark kijiye. Agle din ka intezaar mat kijiye.',
  },
  'kick.early': {
    en: 'Kick counting is usually suggested from week 28. Before that, simply enjoy the flutters!',
    hinglish:
      'Laatein ginna aam taur par week 28 se suggest hota hai. Usse pehle bas phadphadahat ka maza lijiye!',
  },

  // Journal
  'journal.title': { en: 'Letters to Baby', hinglish: 'Baby ko chitthiyan' },
  'journal.new': { en: 'Write a letter', hinglish: 'Chitthi likhiye' },
  'journal.prompt': { en: 'Today’s prompt', hinglish: 'Aaj ka sawaal' },
  'journal.placeholder': { en: 'Dear little one…', hinglish: 'Mere pyaare chhote…' },
  'journal.save': { en: 'Save letter 💌', hinglish: 'Chitthi save 💌' },
  'journal.saved': { en: 'Letter saved 💌', hinglish: 'Chitthi save ho gayi 💌' },
  'journal.orVoice': {
    en: 'Or record a voice letter',
    hinglish: 'Ya awaaz mein chitthi record kijiye',
  },
  'journal.empty': {
    en: 'No letters yet. Your first one will be treasured forever.',
    hinglish: 'Abhi koi chitthi nahi. Pehli chitthi hamesha anmol rahegi.',
  },
  'journal.filter.all': { en: 'All', hinglish: 'Sab' },
  'journal.filter.letter': { en: 'Letters', hinglish: 'Chitthiyan' },
  'journal.filter.reflection': { en: 'Story thoughts', hinglish: 'Kahani ke vichaar' },
  'journal.filter.talk': { en: 'Talks', hinglish: 'Baatein' },
  'journal.voice': { en: 'Voice letter', hinglish: 'Awaaz ki chitthi' },
  'journal.keepsake': { en: 'Print keepsake', hinglish: 'Yaadgaar print' },
  'journal.delete': { en: 'Delete letter', hinglish: 'Chitthi hataayein' },
  'journal.deleteConfirm': {
    en: 'Delete this letter? This can’t be undone.',
    hinglish: 'Yeh chitthi hataayein? Yeh wapas nahi aayegi.',
  },

  // Papa
  'papa.title': { en: 'Papa’s Corner', hinglish: 'Papa ka kona' },
  'papa.intro': {
    en: 'Papa, here is something to read or say to the belly today. Baby can hear your voice!',
    hinglish: 'Papa, aaj pet ke paas padhne ya kehne ke liye kuch. Baby aapki awaaz sun sakta hai!',
  },
  'papa.today': { en: 'Today for Papa', hinglish: 'Aaj Papa ke liye' },
  'papa.done': { en: 'Papa did it 💙', hinglish: 'Papa ne kar diya 💙' },
  'papa.record': { en: 'Papa can record it too', hinglish: 'Papa record bhi kar sakte hain' },
  'papa.earlier': { en: 'Earlier ideas', hinglish: 'Pichhle idea' },

  // Photos
  'photos.title': { en: 'Belly photos', hinglish: 'Pet ki photo' },
  'photos.intro': {
    en: 'One photo a week makes a beautiful slideshow of your journey.',
    hinglish: 'Har hafte ek photo se safar ka sundar slideshow banta hai.',
  },
  'photos.take': { en: 'Take a photo 📷', hinglish: 'Photo khichiye 📷' },
  'photos.pick': { en: 'Choose from gallery 🖼️', hinglish: 'Gallery se chuniye 🖼️' },
  'photos.saving': { en: 'Saving your photo…', hinglish: 'Photo save ho rahi hai…' },
  'photos.saved': {
    en: 'Photo saved for week {week} 📸',
    hinglish: 'Week {week} ki photo save 📸',
  },
  'photos.failed': {
    en: 'That photo couldn’t be saved. Please try another.',
    hinglish: 'Yeh photo save nahi hui. Doosri try kijiye.',
  },
  'photos.week': { en: 'Week {week}', hinglish: 'Week {week}' },
  'photos.slideshow': { en: 'Play slideshow ▶', hinglish: 'Slideshow chalaaiye ▶' },
  'photos.closeSlideshow': { en: 'Close slideshow', hinglish: 'Slideshow band' },
  'photos.empty': { en: 'No photos yet.', hinglish: 'Abhi koi photo nahi.' },
  'photos.tab.belly': { en: 'Belly', hinglish: 'Pet' },
  'photos.tab.sanjhi': { en: 'Sanjhi art', hinglish: 'Sanjhi kala' },
  'photos.delete': { en: 'Delete photo', hinglish: 'Photo hataayein' },
  'photos.deleteConfirm': {
    en: 'Delete this photo? This can’t be undone.',
    hinglish: 'Yeh photo hataayein? Yeh wapas nahi aayegi.',
  },
  'photos.alt': { en: 'Photo from week {week}', hinglish: 'Week {week} ki photo' },
} satisfies Record<string, Translation>;
