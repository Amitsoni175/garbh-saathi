import type { Translation } from '../i18n';

/** App shell, tabs, settings, errors, common UI, debug. */
export const coreStrings = {
  // App
  'app.name': { en: 'Garbh Saathi', hinglish: 'Garbh Saathi' },
  'app.tagline': {
    en: 'A calm space for you and your baby',
    hinglish: 'Aapke aur baby ke liye ek shaant si jagah',
  },

  // Tabs
  'tab.today': { en: 'Today', hinglish: 'Aaj' },
  'tab.calendar': { en: 'Calendar', hinglish: 'Calendar' },
  'tab.play': { en: 'Play', hinglish: 'Khel' },
  'tab.me': { en: 'Me', hinglish: 'Main' },
  'tab.navLabel': { en: 'Main sections', hinglish: 'Mukhya hisse' },

  // Greetings (by time of day)
  'greeting.morning': { en: 'Good morning 🌅', hinglish: 'Ram Ram ji! Suprabhat 🌅' },
  'greeting.afternoon': { en: 'Good afternoon ☀️', hinglish: 'Ram Ram ji! Ke haal sai? ☀️' },
  'greeting.evening': { en: 'Good evening 🌇', hinglish: 'Ram Ram ji! Shubh sandhya 🌇' },
  'greeting.night': { en: 'Good night 🌙', hinglish: 'Ram Ram ji! Shubh ratri 🌙' },

  // Placeholders for upcoming phases
  'today.comingTitle': {
    en: "Today's Journey is on its way",
    hinglish: 'Aaj ki yatra aa rahi hai',
  },
  'today.comingText': {
    en: 'Soon you will set your dates here and see a gentle path of five small activities each day.',
    hinglish:
      'Jaldi hi aap yahan apni dates daalengi aur har din paanch chhoti si activities ka pyaara raasta dekhengi.',
  },
  'calendar.comingTitle': {
    en: 'Your calendar will bloom here',
    hinglish: 'Aapka calendar yahan khilega',
  },
  'calendar.comingText': {
    en: 'Every story, game and letter will leave a soft dot on its day.',
    hinglish: 'Har kahani, khel aur chitthi apne din par ek pyaara sa nishaan chhodegi.',
  },
  'play.comingTitle': { en: 'Little games are coming', hinglish: 'Chhote khel aa rahe hain' },
  'play.comingText': {
    en: 'Memory match, bubble maths, word garden and more. No losing, only smiles.',
    hinglish: 'Memory match, bubble maths, word garden aur bhi bahut. Haarna nahi, bas muskaan.',
  },
  'play.tryPetals': { en: 'Try the petals 🌸', hinglish: 'Phool barsao 🌸' },
  'feedback.wellDone': { en: 'Well done! 🌸', hinglish: 'Ghani badhiya! 🌸' },

  // Me / settings
  'me.title': { en: 'Me', hinglish: 'Main' },
  'settings.textLang': { en: 'Text language', hinglish: 'Likhne ki bhasha' },
  'settings.audioLang': { en: 'Audio language', hinglish: 'Sunne ki bhasha' },
  'settings.lang.en': { en: 'English', hinglish: 'English' },
  'settings.lang.hinglish': { en: 'Hinglish', hinglish: 'Hinglish' },
  'settings.lang.hi': { en: 'Hindi', hinglish: 'Hindi' },
  'settings.nightMode': { en: 'Night mode', hinglish: 'Raat ka mode' },
  'settings.night.auto': { en: 'Auto', hinglish: 'Apne aap' },
  'settings.night.day': { en: 'Always day', hinglish: 'Hamesha din' },
  'settings.night.night': { en: 'Always night', hinglish: 'Hamesha raat' },
  'settings.nightAutoHint': {
    en: 'Auto turns night colours on after 8 PM, or when your phone is in dark mode.',
    hinglish: 'Apne aap: raat 8 baje ke baad, ya phone dark mode mein ho to raat ke rang.',
  },
  'settings.textSize': { en: 'Text size', hinglish: 'Akshar ka size' },
  'settings.size.normal': { en: 'Normal', hinglish: 'Normal' },
  'settings.size.large': { en: 'Large', hinglish: 'Bada' },
  'settings.size.xl': { en: 'Extra large', hinglish: 'Bahut bada' },
  'settings.sounds': { en: 'Sounds', hinglish: 'Awaaz' },
  'settings.vibration': { en: 'Vibration', hinglish: 'Vibration' },
  'settings.about': { en: 'About', hinglish: 'Jaankari' },
  'settings.version': { en: 'Version {version}', hinglish: 'Version {version}' },
  'settings.debugTapsLeft': {
    en: '{count} more taps for the debug panel',
    hinglish: 'Debug panel ke liye {count} baar aur dabayein',
  },
  'settings.privacy': {
    en: 'Everything you add stays on this phone. No account, no internet needed.',
    hinglish: 'Aapka sab kuch isi phone mein rehta hai. Na account, na internet ki zaroorat.',
  },

  // Storage
  'storage.unavailable': {
    en: "This browser isn't letting us save right now (maybe a private window). You can still use the app, but today's activity won't be remembered.",
    hinglish:
      'Yeh browser abhi save nahi karne de raha (shayad private window hai). App chalegi, par aaj ka kaam yaad nahi rahega.',
  },

  // Errors
  'error.title': {
    en: 'Oops, something went wrong here 🌸',
    hinglish: 'Oho, yahan kuch gadbad ho gayi 🌸',
  },
  'error.text': {
    en: "It's not your fault. The rest of the app is fine.",
    hinglish: 'Aapki koi galti nahi. Baaki app theek hai.',
  },
  'error.tryAgain': { en: 'Try again', hinglish: 'Phir se koshish' },
  'error.goHome': { en: 'Go home', hinglish: 'Ghar chalo' },

  // Date validation (used by onboarding and settings)
  'dateError.invalidDate': { en: 'Please pick a date.', hinglish: 'Kripya ek date chuniye.' },
  'dateError.lmpInFuture': {
    en: "That date hasn't come yet. Please pick the first day of your last period.",
    hinglish: 'Yeh date abhi aayi nahi. Kripya last period ka pehla din chuniye.',
  },
  'dateError.lmpTooOld': {
    en: 'That is more than 300 days ago. Could you check the date once more?',
    hinglish: 'Yeh 300 din se zyada purani hai. Ek baar date check kar lijiye?',
  },
  'dateError.eddTooFarAhead': {
    en: 'That due date is more than 300 days away. Could you check it once more?',
    hinglish: 'Yeh due date 300 din se zyada door hai. Ek baar check kar lijiye?',
  },
  'dateError.eddTooFarPast': {
    en: 'That due date was more than a month ago. Could you check it once more?',
    hinglish: 'Yeh due date ek mahine se zyada pehle thi. Ek baar check kar lijiye?',
  },

  // Common UI
  'ui.close': { en: 'Close', hinglish: 'Band karein' },
  'ui.dismiss': { en: 'Dismiss', hinglish: 'Hatayein' },
  'ui.on': { en: 'On', hinglish: 'On' },
  'ui.off': { en: 'Off', hinglish: 'Off' },
  'ui.back': { en: 'Back', hinglish: 'Peeche' },

  // Debug panel (developer-facing, English is fine)
  'debug.title': { en: 'Debug panel 🛠️' },
  'debug.clock': { en: 'Clock' },
  'debug.dateOverride': { en: 'Pretend today is…' },
  'debug.timeOverride': { en: 'Pretend the time is…' },
  'debug.clear': { en: 'Clear' },
  'debug.testLmp': { en: 'Test LMP (until onboarding exists)' },
  'debug.jumpToWeek': { en: 'Jump to week {week}' },
  'debug.state': { en: 'Computed state' },
  'debug.errorLog': { en: 'Error log ({count})' },
  'debug.copy': { en: 'Copy' },
  'debug.copied': { en: 'Copied to clipboard' },
  'debug.copyFailed': { en: 'Could not copy. Long-press the log to select it.' },
  'debug.export': { en: 'Export' },
  'debug.clearLog': { en: 'Clear log' },
  'debug.emptyLog': { en: 'No errors logged. 🌼' },
  'debug.storage': { en: 'Storage' },
  'debug.tools': { en: 'Tools' },
  'debug.simulateError': { en: 'Simulate an error' },
  'debug.simulateAsyncError': { en: 'Simulate an async error' },
  'debug.testToast': { en: 'Show a test toast' },
} satisfies Record<string, Translation>;
