import type { Translation } from '../i18n';

/** Calendar, own events, schedule, reminders, notifications, .ics. */
export const calendarStrings = {
  'cal.title': { en: 'Calendar', hinglish: 'Calendar' },
  'cal.prev': { en: 'Previous month', hinglish: 'Pichhla mahina' },
  'cal.next': { en: 'Next month', hinglish: 'Agla mahina' },
  'cal.today': { en: 'Today', hinglish: 'Aaj' },
  'cal.addEvent': { en: 'Add event', hinglish: 'Event jodiye' },
  'cal.legend.story': { en: 'Story', hinglish: 'Kahani' },
  'cal.legend.game': { en: 'Game', hinglish: 'Khel' },
  'cal.legend.journal': { en: 'Letter', hinglish: 'Chitthi' },
  'cal.legend.kicks': { en: 'Kicks', hinglish: 'Laatein' },
  'cal.dayLabel': { en: '{date}{extra}', hinglish: '{date}{extra}' },
  'cal.activities': { en: '{count} activities', hinglish: '{count} kaam' },
  'cal.exportIcs': {
    en: 'Add reminders to my phone calendar',
    hinglish: 'Reminders phone ke calendar mein',
  },

  // Milestones
  'mile.tri2': { en: 'Second trimester begins 🌿', hinglish: 'Doosri timahi shuru 🌿' },
  'mile.w20': {
    en: 'Week 20: halfway! Kicks may start to feel noticeable 🦶',
    hinglish: 'Week 20: aadha safar! Laatein mehsoos hone lagti hain 🦶',
  },
  'mile.tri3': {
    en: 'Third trimester begins (week 28) 🌳',
    hinglish: 'Teesri timahi shuru (week 28) 🌳',
  },
  'mile.w37': { en: 'Week 37: full term 🌼', hinglish: 'Week 37: poora samay 🌼' },
  'mile.edd': { en: 'Due date 👶', hinglish: 'Due date 👶' },

  // Day sheet
  'day.nothing': {
    en: 'A quiet day. That’s lovely too. 🌙',
    hinglish: 'Ek shaant din. Yeh bhi pyaara hai. 🌙',
  },
  'day.stories': { en: 'Stories', hinglish: 'Kahaniyan' },
  'day.replay': { en: 'Replay', hinglish: 'Dobaara' },
  'day.games': { en: 'Games played: {count}', hinglish: 'Khele gaye khel: {count}' },
  'day.journal': { en: 'Letters & notes', hinglish: 'Chitthiyan aur baatein' },
  'day.voiceNote': { en: 'Voice note', hinglish: 'Awaaz ka sandesh' },
  'day.photos': { en: 'Photos', hinglish: 'Photo' },
  'day.mood': { en: 'Mood', hinglish: 'Mann' },
  'day.water': { en: 'Water: {count} glasses', hinglish: 'Paani: {count} gilaas' },
  'day.tablet': { en: 'Iron / calcium tablet taken 💊', hinglish: 'Iron / calcium tablet li 💊' },
  'day.kicks': { en: '{count} kicks in {min} min', hinglish: '{min} min mein {count} laatein' },
  'day.events': { en: 'Events', hinglish: 'Events' },
  'day.deleteEvent': { en: 'Delete event', hinglish: 'Event hataayein' },
  'day.deleteConfirm': { en: 'Delete “{title}”?', hinglish: '“{title}” hataayein?' },

  // Event form
  'event.title': { en: 'New event', hinglish: 'Naya event' },
  'event.name': { en: 'What is it?', hinglish: 'Kya hai?' },
  'event.namePlaceholder': {
    en: 'e.g. Check-up with Dr. Sharma',
    hinglish: 'jaise Dr. Sharma se check-up',
  },
  'event.kind': { en: 'Type', hinglish: 'Prakaar' },
  'event.kind.doctor': { en: 'Doctor visit 🩺', hinglish: 'Doctor 🩺' },
  'event.kind.scan': { en: 'Scan 🩻', hinglish: 'Scan 🩻' },
  'event.kind.godhBharai': { en: 'Godh Bharai 🎉', hinglish: 'Godh Bharai 🎉' },
  'event.kind.other': { en: 'Other 📌', hinglish: 'Aur 📌' },
  'event.date': { en: 'Date', hinglish: 'Taareekh' },
  'event.time': { en: 'Time (optional)', hinglish: 'Samay (zaroori nahi)' },
  'event.reminder': { en: 'Remind me', hinglish: 'Yaad dilaaiye' },
  'event.reminderHint': {
    en: 'An hour before (or at 8 AM for all-day events)',
    hinglish: 'Ek ghanta pehle (ya poore din ke event par subah 8 baje)',
  },
  'event.notes': { en: 'Notes (optional)', hinglish: 'Note (zaroori nahi)' },
  'event.save': { en: 'Save event', hinglish: 'Event save' },
  'event.saved': { en: 'Event saved 📌', hinglish: 'Event save ho gaya 📌' },

  // Up next
  'next.title': { en: 'Coming up next', hinglish: 'Aage kya hai' },
  'next.none': {
    en: 'Nothing more today. Rest well 🌙',
    hinglish: 'Aaj aur kuch nahi. Aaraam kijiye 🌙',
  },

  // Gentle reminder wording
  'remind.shloka': {
    en: '🌅 A morning shloka and raga with your little one?',
    hinglish: '🌅 Baby ke saath subah ka shloka aur raag?',
  },
  'remind.tablet': {
    en: '💊 Time for your iron / calcium tablet 💛',
    hinglish: '💊 Iron / calcium tablet ka samay 💛',
  },
  'remind.story': {
    en: '🌸 Story time with your little one?',
    hinglish: '🌸 Baby ke saath kahani ka samay?',
  },
  'remind.game': { en: '🎮 A little game break?', hinglish: '🎮 Thoda sa khel ho jaaye?' },
  'remind.night': {
    en: '🌙 Lullaby, a chat with baby, and a letter?',
    hinglish: '🌙 Lori, baby se baat aur ek chitthi?',
  },
  'remind.water': { en: '💧 A few sips of water?', hinglish: '💧 Thoda paani pee lein?' },
  'remind.kicks': { en: '👣 A calm kick count with baby?', hinglish: '👣 Baby ki laatein ginein?' },
  'remind.event': { en: '📌 Coming up: {title}', hinglish: '📌 Aane wala: {title}' },

  // Schedule screen
  'sched.title': { en: 'Schedule & reminders', hinglish: 'Dinchrya aur yaad' },
  'sched.daily': { en: 'Daily rhythm', hinglish: 'Roz ki dinchrya' },
  'sched.item.shloka': { en: 'Morning shloka and raga', hinglish: 'Subah shloka aur raag' },
  'sched.item.tablet': { en: 'Iron / calcium tablet', hinglish: 'Iron / calcium tablet' },
  'sched.item.story': { en: 'Story time', hinglish: 'Kahani ka samay' },
  'sched.item.game': { en: 'Game break', hinglish: 'Khel ka samay' },
  'sched.item.night': {
    en: 'Lullaby, talk to baby, journal',
    hinglish: 'Lori, baby se baat, chitthi',
  },
  'sched.time': { en: 'Time for {name}', hinglish: '{name} ka samay' },
  'sched.water': { en: 'Water reminders', hinglish: 'Paani ki yaad' },
  'sched.waterEvery': {
    en: 'Every {h} hours, {from}–{to}',
    hinglish: 'Har {h} ghante, {from}–{to}',
  },
  'sched.waterSummer': {
    en: 'In summer, every 2 hours is best.',
    hinglish: 'Garmi mein har 2 ghante sabse achha.',
  },
  'sched.hours': { en: '{h} h', hinglish: '{h} ghante' },
  'sched.kicks': { en: 'Kick count reminder', hinglish: 'Laatein ginne ki yaad' },
  'sched.kicksHint': {
    en: 'Suggested from week 28.',
    hinglish: 'Week 28 se suggest kiya jaata hai.',
  },
  'sched.howTitle': { en: 'How reminders reach you', hinglish: 'Yaad aap tak kaise pahunchegi' },
  'sched.icsTitle': {
    en: 'Most reliable: add to your phone calendar',
    hinglish: 'Sabse pakka: phone ke calendar mein jodiye',
  },
  'sched.icsText': {
    en: 'This downloads a calendar file with all your daily reminders (with alarms) and your events. Open it and choose Google Calendar or your phone’s calendar. Your phone will remind you even when this app is closed. Download it again after changing times.',
    hinglish:
      'Isse ek calendar file download hogi jismein aapki roz ki saari yaad (alarm ke saath) aur events honge. Use kholkar Google Calendar ya phone ka calendar chuniye. App band ho tab bhi phone yaad dilaayega. Samay badalne ke baad dobaara download kijiye.',
  },
  'sched.icsButton': {
    en: 'Add to my phone calendar 📲',
    hinglish: 'Phone ke calendar mein jodiye 📲',
  },
  'sched.icsDone': {
    en: 'Calendar file ready. Open it to add the reminders.',
    hinglish: 'Calendar file taiyaar. Use kholkar reminders jodiye.',
  },
  'sched.notifTitle': { en: 'In-app notifications', hinglish: 'App ki notification' },
  'sched.notifText': {
    en: 'The app can also pop up a gentle reminder while it is open or was recently used. It can’t when the app is fully closed, which is why the calendar option above is best.',
    hinglish:
      'App khuli ho ya abhi istemaal hui ho, tab bhi halki si yaad dikha sakti hai. Poori band hone par nahi, isliye upar wala calendar tareeka sabse achha hai.',
  },
  'sched.notifOn': { en: 'Show notifications', hinglish: 'Notification dikhaaiye' },
  'sched.askTitle': { en: 'Allow gentle reminders?', hinglish: 'Pyaari yaad ki ijaazat dein?' },
  'sched.askText': {
    en: 'Your phone will now ask whether Garbh Saathi may show notifications. We only send the reminders you choose, never ads. You can turn them off any time.',
    hinglish:
      'Ab phone poochhega ki kya Garbh Saathi notification dikha sakti hai. Hum sirf aapki chuni hui yaad bhejenge, kabhi ad nahi. Kabhi bhi band kar sakti hain.',
  },
  'sched.allow': { en: 'Continue', hinglish: 'Aage badhiye' },
  'sched.notNow': { en: 'Not now', hinglish: 'Abhi nahi' },
  'sched.denied': {
    en: 'Notifications are blocked. To allow them: open your browser’s site settings for this app (lock icon or ⋮ → Site settings) → Notifications → Allow. Everything else keeps working.',
    hinglish:
      'Notification band hain. Chaalu karne ke liye: browser ki site settings kholiye (taala ya ⋮ → Site settings) → Notifications → Allow. Baaki sab chalta rahega.',
  },
  'sched.unsupported': {
    en: 'This browser can’t show notifications. Please use the calendar option above.',
    hinglish: 'Yeh browser notification nahi dikha sakta. Upar wala calendar tareeka apnaaiye.',
  },
  'sched.iosNote': {
    en: 'On iPhone, notifications need iOS 16.4 or newer and the app added to your Home Screen (Share → Add to Home Screen).',
    hinglish:
      'iPhone par notification ke liye iOS 16.4 ya naya aur app Home Screen par honi chahiye (Share → Add to Home Screen).',
  },
  'sched.test': { en: 'Send a test notification', hinglish: 'Test notification bhejiye' },
  'sched.testBody': {
    en: 'This is how a gentle reminder will look 🌸',
    hinglish: 'Pyaari yaad aise dikhegi 🌸',
  },
} satisfies Record<string, Translation>;
