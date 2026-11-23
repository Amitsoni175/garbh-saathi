import type { Translation } from '../i18n';

/** Stories, library, audio player, recording. */
export const storyStrings = {
  // Library
  'stories.title': { en: 'Story library', hinglish: 'Kahaniyon ki library' },
  'stories.subtitle': {
    en: 'Every story you have unlocked',
    hinglish: 'Aapki khuli hui saari kahaniyan',
  },
  'stories.moreComing': {
    en: '{count} more stories will unlock, one day at a time 🌱',
    hinglish: '{count} aur kahaniyan roz ek-ek karke khulengi 🌱',
  },
  'stories.today': { en: 'Today', hinglish: 'Aaj' },
  'stories.heard': { en: 'Heard', hinglish: 'Suni' },
  'stories.part': { en: 'Part {part}', hinglish: 'Bhaag {part}' },
  'stories.notFound': {
    en: 'This story isn’t here. It may still be locked, or the content has an error.',
    hinglish: 'Yeh kahani yahan nahi hai. Shayad abhi band hai, ya content mein galti hai.',
  },
  'stories.loading': { en: 'Opening the story book…', hinglish: 'Kahani ki kitaab khul rahi hai…' },
  'stories.openLibrary': { en: 'All stories', hinglish: 'Saari kahaniyan' },

  // Player
  'story.cardOf': { en: '{n} of {total}', hinglish: '{n} / {total}' },
  'story.prev': { en: 'Previous card', hinglish: 'Pichhla card' },
  'story.next': { en: 'Next', hinglish: 'Aage' },
  'story.swipeHint': { en: 'Swipe or tap Next', hinglish: 'Swipe kijiye ya Aage dabaaiye' },
  'story.readAloud': { en: 'Read-aloud mode', hinglish: 'Khud padhkar sunaaiye' },
  'story.readAloudHint': {
    en: 'Big text, so you can read to baby in your own voice.',
    hinglish: 'Bade akshar, taaki aap apni awaaz mein baby ko padh sakein.',
  },
  'story.tapPicture': { en: 'Tap the picture!', hinglish: 'Tasveer ko chhuiye!' },
  'story.iSaidIt': { en: 'I said it to baby', hinglish: 'Maine baby se kaha' },
  'story.saidIt': { en: 'Baby heard you', hinglish: 'Baby ne sun liya' },
  'story.howFeel': { en: 'How does this part feel?', hinglish: 'Yeh hissa kaisa laga?' },
  'story.react': { en: 'Feels like {emoji}', hinglish: 'Laga {emoji}' },
  'story.quickCheck': {
    en: 'Quick check: true or false?',
    hinglish: 'Jhatpat sawaal: sach ya jhooth?',
  },
  'story.checkRight': {
    en: 'Shabaash! You listened so well 🌸',
    hinglish: 'Shabaash! Aapne kitne dhyaan se suna 🌸',
  },
  'story.checkGentle': {
    en: 'Good thinking! The story says: {answer}. Now you both know 💛',
    hinglish: 'Achha socha! Kahani kehti hai: {answer}. Ab aap dono jaante hain 💛',
  },
  'story.sayThis': { en: 'Say this to your baby', hinglish: 'Baby se yeh kahiye' },
  'story.listen': { en: 'Listen', hinglish: 'Suniye' },
  'story.pause': { en: 'Pause', hinglish: 'Rokiye' },
  'story.moral': { en: 'The lesson', hinglish: 'Seekh' },
  'story.reflection': { en: 'A thought for you', hinglish: 'Aapke liye ek sawaal' },
  'story.reflectionPlaceholder': {
    en: 'Write a line, or record your voice…',
    hinglish: 'Ek line likhiye, ya awaaz record kijiye…',
  },
  'story.saveReflection': { en: 'Save to my letters', hinglish: 'Meri chitthiyon mein save' },
  'story.finish': { en: 'Finish story 🌸', hinglish: 'Kahani poori 🌸' },
  'story.finished': {
    en: 'Story complete! A flower for baby’s garden 🌸',
    hinglish: 'Kahani poori! Baby ke bagiche mein ek phool 🌸',
  },
  'story.nextPartTomorrow': { en: 'Part {part} tomorrow ✨', hinglish: 'Bhaag {part} kal ✨' },
  'story.familyVoice': { en: 'Family voice', hinglish: 'Parivaar ki awaaz' },
  'story.defaultVoice': { en: 'Default voice', hinglish: 'Saadhaaran awaaz' },
  'story.recordTitle': {
    en: 'Record this story in your voice',
    hinglish: 'Yeh kahani apni awaaz mein record kijiye',
  },
  'story.recordHint': {
    en: 'Tap record, then read the cards aloud, swiping as you go. Mummy, Papa, Dadi or Nani can all record.',
    hinglish:
      'Record dabaaiye, phir card padhte jaaiye aur swipe kijiye. Mummy, Papa, Dadi ya Nani sab record kar sakte hain.',
  },
  'story.recordButton': { en: 'Record in your voice 🎙️', hinglish: 'Apni awaaz mein record 🎙️' },

  // Audio player
  'player.play': { en: 'Play', hinglish: 'Chalaaiye' },
  'player.pause': { en: 'Pause', hinglish: 'Rokiye' },
  'player.close': { en: 'Close player', hinglish: 'Player band karein' },
  'player.expand': { en: 'Player controls', hinglish: 'Player ke control' },
  'player.speed': { en: 'Speed', hinglish: 'Raftaar' },
  'player.sleep': { en: 'Sleep timer', hinglish: 'Sone ka timer' },
  'player.sleepOff': { en: 'Off', hinglish: 'Band' },
  'player.sleepMin': { en: '{min} min', hinglish: '{min} min' },
  'player.sleepLeft': { en: 'Stops in {min} min', hinglish: '{min} min mein rukega' },
  'player.seek': { en: 'Position', hinglish: 'Jagah' },
  'player.part': { en: 'Part {n} of {total}', hinglish: 'Hissa {n} / {total}' },
  'player.source.recording': { en: 'Family voice', hinglish: 'Parivaar ki awaaz' },
  'player.source.file': { en: 'Audio', hinglish: 'Audio' },
  'player.source.tts': { en: 'Phone voice', hinglish: 'Phone ki awaaz' },
  'player.tapToPlay': {
    en: 'Tap play to start the sound',
    hinglish: 'Awaaz ke liye play dabaaiye',
  },
  'player.missing': { en: 'No audio for this yet.', hinglish: 'Iska audio abhi nahi hai.' },
  'player.failed': {
    en: 'The sound couldn’t play. Check the volume and silent switch, then try again.',
    hinglish: 'Awaaz nahi chali. Volume aur silent switch dekhiye, phir dobaara koshish kijiye.',
  },
  'player.noVoiceTitle': {
    en: 'No Hindi voice on this phone yet',
    hinglish: 'Is phone mein abhi Hindi awaaz nahi hai',
  },
  'player.noVoiceText': {
    en: 'For now I’m reading in English. To hear Hindi: Android → Settings → search “Text-to-speech” → Speech Services by Google → Install voice data → Hindi. Or simply record the story in your own voice, which is even better!',
    hinglish:
      'Abhi English mein padh rahi hoon. Hindi sunne ke liye: Android → Settings → "Text-to-speech" dhoondhiye → Speech Services by Google → Install voice data → Hindi. Ya kahani apni awaaz mein record kijiye, woh aur bhi pyaari hai!',
  },
  'player.ok': { en: 'Okay', hinglish: 'Theek hai' },

  // Recorder
  'rec.start': { en: 'Record', hinglish: 'Record' },
  'rec.stop': { en: 'Stop and save', hinglish: 'Rokiye aur save' },
  'rec.cancel': { en: 'Cancel', hinglish: 'Radd karein' },
  'rec.recording': { en: 'Recording… {time}', hinglish: 'Record ho raha hai… {time}' },
  'rec.saved': { en: 'Saved in your voice 💛', hinglish: 'Aapki awaaz mein save ho gaya 💛' },
  'rec.who': { en: 'Who is speaking?', hinglish: 'Kaun bol raha hai?' },
  'rec.who.mummy': { en: 'Mummy', hinglish: 'Mummy' },
  'rec.who.papa': { en: 'Papa', hinglish: 'Papa' },
  'rec.who.dadi': { en: 'Dadi', hinglish: 'Dadi' },
  'rec.who.nani': { en: 'Nani', hinglish: 'Nani' },
  'rec.who.other': { en: 'Someone else', hinglish: 'Koi aur' },
  'rec.denied': {
    en: 'The microphone is blocked. Allow it in your browser’s site settings (the lock icon next to the address), then try again.',
    hinglish:
      'Microphone band hai. Browser ki site settings (address ke paas taale ka nishaan) mein allow kijiye, phir dobaara koshish kijiye.',
  },
  'rec.unsupported': {
    en: 'Recording isn’t supported in this browser. Try Chrome on Android or Safari on iPhone.',
    hinglish:
      'Is browser mein recording nahi hoti. Android par Chrome ya iPhone par Safari try kijiye.',
  },
  'rec.failed': {
    en: 'Recording didn’t work this time. Please try again.',
    hinglish: 'Is baar recording nahi hui. Dobaara koshish kijiye.',
  },
  'rec.list': { en: 'Family recordings', hinglish: 'Parivaar ki recordings' },
  'rec.play': { en: 'Play recording by {who}', hinglish: '{who} ki recording chalaaiye' },
  'rec.delete': { en: 'Delete recording', hinglish: 'Recording hataayein' },
  'rec.deleteConfirm': {
    en: 'Delete this recording? This can’t be undone.',
    hinglish: 'Yeh recording hataayein? Yeh wapas nahi aayegi.',
  },
  'rec.deleteYes': { en: 'Yes, delete', hinglish: 'Haan, hataayein' },
  'rec.keep': { en: 'Keep it', hinglish: 'Rehne dein' },
  'rec.none': { en: 'No recordings yet.', hinglish: 'Abhi koi recording nahi.' },
} satisfies Record<string, Translation>;
