import type { Translation } from '../i18n';

/** Me hub, profile, backup & restore, updates, install, keepsake, debug extras. */
export const appStrings = {
  // Me hub
  'me.journey': { en: 'My journey', hinglish: 'Mera safar' },
  'me.edd': { en: 'Due date: {date}', hinglish: 'Due date: {date}' },
  'me.edit': { en: 'Edit profile and dates', hinglish: 'Profile aur dates badlein' },
  'me.bonding': { en: 'Bonding', hinglish: 'Rishta' },
  'me.care': { en: 'Care', hinglish: 'Dekhbhaal' },
  'me.settings': { en: 'Settings', hinglish: 'Settings' },
  'me.link.journal': { en: 'Letters', hinglish: 'Chitthiyan' },
  'me.link.photos': { en: 'Belly photos', hinglish: 'Pet ki photo' },
  'me.link.papa': { en: 'Papa’s corner', hinglish: 'Papa ka kona' },
  'me.link.kicks': { en: 'Kick counter', hinglish: 'Laatein ginna' },
  'me.link.talk': { en: 'Talk to baby', hinglish: 'Baby se baat' },
  'me.link.garden': { en: 'Garden', hinglish: 'Bagicha' },
  'me.link.wellness': { en: 'Wellness', hinglish: 'Sehat' },
  'me.link.help': { en: 'Help & danger signs', hinglish: 'Madad aur khatre ke sanket' },
  'me.link.schedule': { en: 'Schedule & reminders', hinglish: 'Dinchrya aur yaad' },
  'me.link.godhBharai': { en: 'Godh Bharai memories', hinglish: 'Godh Bharai ki yaadein' },
  'me.link.backup': { en: 'Backup & restore', hinglish: 'Backup aur restore' },
  'me.link.keepsake': { en: 'Keepsake letters', hinglish: 'Yaadgaar chitthiyan' },
  'me.link.festivals': { en: 'Festivals', hinglish: 'Tyohaar' },
  'settings.relaxedTimer': { en: 'Relaxed timer in games', hinglish: 'Khel mein aaraam ka timer' },
  'settings.relaxedTimerHint': {
    en: 'A gentle count-up, never a countdown.',
    hinglish: 'Dheere badhta timer, kabhi ulti ginti nahi.',
  },

  // Profile
  'profile.title': { en: 'Profile and dates', hinglish: 'Profile aur dates' },
  'profile.datesNote': {
    en: 'Your doctor may revise the due date after a scan. Change it here and every screen updates.',
    hinglish:
      'Scan ke baad doctor due date badal sakte hain. Yahan badaliye, har screen apne aap badlegi.',
  },
  'profile.save': { en: 'Save changes', hinglish: 'Badlaav save' },
  'profile.saved': {
    en: 'Saved. You are at Week {week} · Day {day} 🌸',
    hinglish: 'Save hua. Aap Week {week} · Din {day} par hain 🌸',
  },

  // Backup
  'backup.title': { en: 'Backup & restore', hinglish: 'Backup aur restore' },
  'backup.why': {
    en: 'Everything lives only on this phone. A backup file keeps your letters, photos and recordings safe, and moves them to a new phone.',
    hinglish:
      'Sab kuch sirf isi phone mein hai. Backup file se aapki chitthiyan, photo aur recordings surakshit rehti hain, aur naye phone mein bhi aa jaati hain.',
  },
  'backup.export': { en: 'Export backup file', hinglish: 'Backup file banaaiye' },
  'backup.exporting': { en: 'Packing your memories…', hinglish: 'Yaadein pack ho rahi hain…' },
  'backup.exported': {
    en: 'Backup ready: {file}. Keep it somewhere safe (Google Drive, WhatsApp to yourself, a computer).',
    hinglish:
      'Backup taiyaar: {file}. Ise surakshit jagah rakhiye (Google Drive, khud ko WhatsApp, computer).',
  },
  'backup.import': { en: 'Restore from a backup file', hinglish: 'Backup file se wapas laaiye' },
  'backup.reading': { en: 'Reading the file…', hinglish: 'File padh rahe hain…' },
  'backup.invalid': {
    en: 'This doesn’t look like a Garbh Saathi backup file. Nothing was changed.',
    hinglish: 'Yeh Garbh Saathi ki backup file nahi lagti. Kuch nahi badla.',
  },
  'backup.summary': {
    en: 'This backup from {date} has:',
    hinglish: '{date} ke is backup mein hai:',
  },
  'backup.counts': {
    en: '{journal} letters, {photos} photos, {recordings} recordings, {completions} garden flowers, {events} events, {kicks} kick sessions',
    hinglish:
      '{journal} chitthiyan, {photos} photo, {recordings} recordings, {completions} bagiche ke phool, {events} events, {kicks} laat-session',
  },
  'backup.replaceWarn': {
    en: 'Restoring replaces what is on this phone now with the backup.',
    hinglish: 'Restore karne se is phone ka abhi ka data backup se badal jaayega.',
  },
  'backup.confirm': { en: 'Yes, restore', hinglish: 'Haan, restore' },
  'backup.cancel': { en: 'Cancel', hinglish: 'Radd' },
  'backup.restored': {
    en: 'Welcome back! Everything is restored 🌸',
    hinglish: 'Wapas swagat! Sab kuch aa gaya 🌸',
  },
  'backup.failed': {
    en: 'Restore didn’t complete. Your current data was kept.',
    hinglish: 'Restore poora nahi hua. Aapka abhi ka data surakshit hai.',
  },
  'backup.last': { en: 'Last backup: {date}', hinglish: 'Pichhla backup: {date}' },
  'backup.never': { en: 'No backup yet.', hinglish: 'Abhi tak koi backup nahi.' },
  'backup.reminderTitle': {
    en: 'A gentle reminder to back up 💾',
    hinglish: 'Backup ki pyaari yaad 💾',
  },
  'backup.reminderText': {
    en: 'It’s been a while. One tap keeps your letters and photos safe.',
    hinglish: 'Kaafi din ho gaye. Ek tap se chitthiyan aur photo surakshit.',
  },
  'backup.reminderLater': { en: 'Later', hinglish: 'Baad mein' },

  // App updates and repair
  'update.ready': { en: 'A new version is ready ✨', hinglish: 'Naya version taiyaar hai ✨' },
  'update.refresh': { en: 'Refresh', hinglish: 'Refresh' },
  'update.offlineReady': {
    en: 'Ready to work offline 🌸',
    hinglish: 'Ab bina internet ke bhi chalegi 🌸',
  },
  'update.title': { en: 'App care', hinglish: 'App ki dekhbhaal' },
  'update.check': { en: 'Refresh app', hinglish: 'App refresh' },
  'update.checking': { en: 'Checking for updates…', hinglish: 'Update dekh rahe hain…' },
  'update.latest': {
    en: 'You have the latest version 🌸',
    hinglish: 'Aapke paas naya version hai 🌸',
  },
  'update.auto': {
    en: 'Auto refresh every 6 hours',
    hinglish: 'Har 6 ghante mein apne aap refresh',
  },
  'update.autoHint': {
    en: 'New stories and fixes arrive on their own, at a quiet moment (never in the middle of a story).',
    hinglish:
      'Nayi kahaniyan aur sudhaar apne aap aayenge, shaant samay par (kahani ke beech kabhi nahi).',
  },
  'update.fix': { en: 'Fix app', hinglish: 'App theek karein' },
  'update.fixExplain': {
    en: 'Use this if the app looks blank or stuck after an update. It clears the app’s saved files and reloads. Your letters, photos and progress are NOT deleted.',
    hinglish:
      'Agar update ke baad app khaali ya atki dikhe to yeh use kijiye. Isse app ki purani files saaf hokar reload hogi. Aapki chitthiyan, photo aur progress delete NAHI honge.',
  },
  'update.fixConfirm': { en: 'Yes, fix the app', hinglish: 'Haan, app theek karein' },
  'install.title': { en: 'Install on your phone', hinglish: 'Phone par install kijiye' },
  'install.button': { en: 'Install Garbh Saathi', hinglish: 'Garbh Saathi install kijiye' },
  'install.ios': {
    en: 'On iPhone: tap Share (the square with an arrow) → Add to Home Screen.',
    hinglish: 'iPhone par: Share (teer wala dabba) dabaaiye → Add to Home Screen.',
  },
  'install.android': {
    en: 'On Android Chrome: tap ⋮ → Install app (or Add to Home screen).',
    hinglish: 'Android Chrome par: ⋮ dabaaiye → Install app (ya Add to Home screen).',
  },
  'install.done': {
    en: 'Installed. Find it on your home screen 🌸',
    hinglish: 'Install ho gaya. Home screen par dekhiye 🌸',
  },

  // Keepsake
  'keep.title': { en: 'Letters to my baby', hinglish: 'Mere baby ke liye chitthiyan' },
  'keep.subtitle': { en: 'A keepsake from {name}', hinglish: '{name} ki taraf se yaadgaar' },
  'keep.print': { en: 'Print or save as PDF 🖨️', hinglish: 'Print ya PDF save 🖨️' },
  'keep.howPdf': {
    en: 'In the print window, choose “Save as PDF” to keep a file.',
    hinglish: 'Print window mein “Save as PDF” chuniye, file ban jaayegi.',
  },
  'keep.voiceNote': {
    en: '🎙️ Voice letter recorded on this day',
    hinglish: '🎙️ Is din awaaz ki chitthi record hui',
  },
  'keep.empty': {
    en: 'Write a few letters first, and they will appear here beautifully.',
    hinglish: 'Pehle kuch chitthiyan likhiye, phir woh yahan sundar dikhengi.',
  },

  // Debug extras
  'debug.validation': { en: 'Content validation report' },
  'debug.validationOk': { en: 'All content is valid ✅' },
  'debug.voices': { en: 'Speech voices ({count})' },
  'debug.testHindi': { en: 'Test Hindi voice' },
  'debug.testEnglish': { en: 'Test English voice' },
  'debug.testNotification': { en: 'Test notification' },
  'debug.resetOnboarding': { en: 'Reset onboarding' },
  'debug.wipe': { en: 'Wipe ALL data' },
  'debug.wipeConfirm1': {
    en: 'This deletes every letter, photo and recording on this phone. Are you sure?',
  },
  'debug.wipeConfirm2': { en: 'Really? Last chance. Type DELETE to confirm.' },
  'debug.wipeDone': { en: 'All data wiped.' },
  'debug.plan': { en: 'Today’s plan' },
  'debug.season': { en: 'Season' },
} satisfies Record<string, Translation>;
