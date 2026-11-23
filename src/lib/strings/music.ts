import type { Translation } from '../i18n';

/** Music corner: ragas, mantras, breathing, lok geet, karaoke. */
export const musicStrings = {
  'music.title': { en: 'Music corner', hinglish: 'Sangeet kona' },
  'music.subtitle': {
    en: 'Soft sounds for you and baby',
    hinglish: 'Aapke aur baby ke liye komal sur',
  },
  'music.ragaNow': { en: 'Raga of the moment', hinglish: 'Is pal ka raag' },
  'music.mantras': { en: 'Mantra counter', hinglish: 'Mantra jaap' },
  'music.breathe': { en: 'Breathing bubble', hinglish: 'Saans ka bulbula' },
  'music.breatheText': {
    en: '4 in, 4 out, for 1, 3 or 5 minutes',
    hinglish: '4 andar, 4 bahar, 1, 3 ya 5 minute',
  },
  'music.lokgeet': { en: 'Lok Geet shelf', hinglish: 'Lok geet ki almaari' },
  'music.lokgeetText': {
    en: 'Haryanvi folk songs, jachcha geet and loris, in your family’s voices',
    hinglish: 'Haryanvi lok geet, jachcha geet aur loriyan, parivaar ki awaaz mein',
  },
  'music.sing': { en: 'Sing to baby', hinglish: 'Baby ke liye gaaiye' },

  // Raga
  'raga.title': { en: 'Raga', hinglish: 'Raag' },
  'raga.mood': { en: 'Mood', hinglish: 'Bhaav' },
  'raga.bestTime': { en: 'Best time', hinglish: 'Sahi samay' },
  'raga.play': { en: 'Play raga', hinglish: 'Raag chalaaiye' },
  'raga.listened': { en: 'I listened 🌸', hinglish: 'Maine suna 🌸' },
  'raga.breatheInstead': { en: 'Breathe with it instead', hinglish: 'Iske saath saans lijiye' },
  'raga.all': { en: 'All ragas', hinglish: 'Saare raag' },
  'raga.now': { en: 'now', hinglish: 'abhi' },
  'raga.slot.morning': { en: 'Morning', hinglish: 'Subah' },
  'raga.slot.afternoon': { en: 'Afternoon', hinglish: 'Dopahar' },
  'raga.slot.evening': { en: 'Evening', hinglish: 'Shaam' },
  'raga.slot.night': { en: 'Night', hinglish: 'Raat' },
  'audio.missingTitle': { en: 'Add an audio file 🎵', hinglish: 'Audio file jodiye 🎵' },
  'audio.missingText': {
    en: 'There’s no recording here yet. To add one, put an MP3 named “{file}” in the folder “{folder}” of the app, then rebuild. Until then, you can still sit quietly, breathe, and hum softly to baby.',
    hinglish:
      'Yahan abhi recording nahi hai. Jodne ke liye app ke “{folder}” folder mein “{file}” naam ki MP3 rakhiye aur dobaara build kijiye. Tab tak shaanti se baithkar saans lijiye aur baby ke liye halka gungunaaiye.',
  },
  'audio.checking': { en: 'Looking for the audio…', hinglish: 'Audio dhoondh rahe hain…' },

  // Mantra
  'mantra.title': { en: 'Mantra counter', hinglish: 'Mantra jaap' },
  'mantra.choose': { en: 'Mantra', hinglish: 'Mantra' },
  'mantra.target': { en: 'Repetitions', hinglish: 'Kitni baar' },
  'mantra.tap': { en: 'Tap after each mantra', hinglish: 'Har mantra ke baad dabaaiye' },
  'mantra.count': { en: '{count} of {target}', hinglish: '{count} / {target}' },
  'mantra.done': {
    en: 'Complete 🔔 What a peaceful moment.',
    hinglish: 'Poora hua 🔔 Kitna shaant pal.',
  },
  'mantra.again': { en: 'Start again', hinglish: 'Phir se' },
  'mantra.playLoop': {
    en: 'Play mantra audio (loop)',
    hinglish: 'Mantra audio chalaaiye (baar-baar)',
  },
  'mantra.tapLabel': {
    en: 'Count one mantra. {count} so far.',
    hinglish: 'Ek mantra giniye. Ab tak {count}.',
  },

  // Breathing
  'breathe.title': { en: 'Breathing bubble', hinglish: 'Saans ka bulbula' },
  'breathe.minutes': { en: '{min} min', hinglish: '{min} min' },
  'breathe.withMusic': { en: 'With soft raga music', hinglish: 'Komal raag ke saath' },
  'breathe.start': { en: 'Start', hinglish: 'Shuru' },
  'breathe.stop': { en: 'Stop', hinglish: 'Rokiye' },
  'breathe.in': { en: 'Breathe in…', hinglish: 'Saans andar…' },
  'breathe.out': { en: 'Breathe out…', hinglish: 'Saans bahar…' },
  'breathe.left': { en: '{time} left', hinglish: '{time} baaki' },
  'breathe.done': {
    en: 'Lovely. Your body and baby thank you. 🌿',
    hinglish: 'Bahut sundar. Aapka sharir aur baby shukriya kehte hain. 🌿',
  },
  'breathe.note': {
    en: 'Breathe gently, never strain. Stop if you feel dizzy.',
    hinglish: 'Dheere saans lijiye, zor mat lagaaiye. Chakkar aaye to ruk jaaiye.',
  },

  // 5-minute calm (guided breathing)
  'calm.title': { en: '5-minute calm', hinglish: '5 minute ki shaanti' },
  'calm.subtitle': {
    en: 'A guided breathing break in five gentle parts',
    hinglish: 'Paanch komal hisson mein saans ka aaraam',
  },
  'calm.cardText': {
    en: 'Settle, belly breaths, long out-breaths, a soft hum, and a hug for baby.',
    hinglish: 'Shaant baithna, pet se saans, lambi saans bahar, halki gunjan, aur baby ko jhappi.',
  },
  'calm.start': { en: 'Begin 5 minutes', hinglish: '5 minute shuru' },
  'calm.pause': { en: 'Pause', hinglish: 'Rokiye' },
  'calm.resume': { en: 'Continue', hinglish: 'Jaari rakhiye' },
  'calm.restart': { en: 'Start again', hinglish: 'Phir se' },
  'calm.voice': { en: 'Voice guide', hinglish: 'Awaaz se maargdarshan' },
  'calm.voiceHint': {
    en: 'The phone gently reads each step aloud.',
    hinglish: 'Phone har kadam dheere se padhkar sunaayega.',
  },
  'calm.bell': { en: 'Soft bell between parts', hinglish: 'Hisson ke beech halki ghanti' },
  'calm.part': { en: 'Part {n} of 5', hinglish: 'Hissa {n} / 5' },
  'calm.left': { en: '{time} left', hinglish: '{time} baaki' },
  'calm.in': { en: 'Breathe in', hinglish: 'Saans andar' },
  'calm.out': { en: 'Breathe out', hinglish: 'Saans bahar' },
  'calm.hum': { en: 'Hummm…', hinglish: 'Hmmm…' },
  'calm.rest': { en: 'Just be', hinglish: 'Bas rahiye' },
  'calm.settle.name': { en: 'Settle in', hinglish: 'Shaant baithiye' },
  'calm.settle.text': {
    en: 'Sit or lie on your left side, comfortably. Rest one hand on your heart and one on your belly. Let your shoulders drop. Just notice your breath.',
    hinglish:
      'Aaraam se baithiye ya baayin karwat letiye. Ek haath dil par, ek pet par rakhiye. Kandhe dheele chhodiye. Bas apni saans ko mehsoos kijiye.',
  },
  'calm.belly.name': { en: 'Belly breathing', hinglish: 'Pet se saans' },
  'calm.belly.text': {
    en: 'Breathe in for 4, and feel your belly rise under your hand. Breathe out for 4, and feel it soften. Slow and easy.',
    hinglish:
      'Chaar tak saans andar, haath ke neeche pet upar uthta mehsoos kijiye. Chaar tak saans bahar, pet naram hota hai. Dheere aur aaraam se.',
  },
  'calm.long.name': { en: 'Long out-breath', hinglish: 'Lambi saans bahar' },
  'calm.long.text': {
    en: 'Breathe in for 4. Now breathe out slowly for 6, like blowing on hot chai. A longer out-breath tells your body: all is well.',
    hinglish:
      'Chaar tak saans andar. Ab chhe tak dheere bahar, jaise garam chai par phoonk maarte hain. Lambi saans bahar sharir ko kehti hai: sab theek hai.',
  },
  'calm.hum.name': { en: 'Gentle hum (Bhramari)', hinglish: 'Halki gunjan (Bhraamari)' },
  'calm.hum.text': {
    en: 'Breathe in softly. As you breathe out, hum “hmmm” like a bee, with lips closed. Baby can feel the gentle vibration. Keep it soft, never forced.',
    hinglish:
      'Dheere saans andar lijiye. Bahar chhodte samay hont band karke bhanware jaisi “hmmm” gunjan kijiye. Baby ko yeh halki tharthrahat mehsoos hoti hai. Halke se, zor mat lagaaiye.',
  },
  'calm.close.name': { en: 'A hug for baby', hinglish: 'Baby ko jhappi' },
  'calm.close.text': {
    en: 'Breathe naturally. Place both hands on your belly and say softly: “We are calm. We are together. I love you.”',
    hinglish:
      'Saans apne aap chalne dijiye. Dono haath pet par rakhiye aur dheere se kahiye: “Hum shaant hain. Hum saath hain. Main tumse pyaar karti hoon.”',
  },
  'calm.done': {
    en: 'Five calm minutes, for you and baby. Ghani badhiya! 🌿',
    hinglish: 'Aapke aur baby ke liye paanch shaant minute. Ghani badhiya! 🌿',
  },
  'calm.safety': {
    en: 'Breathe gently and never hold your breath. Avoid lying flat on your back after the first trimester. Stop if you feel dizzy or short of breath. Please check with your doctor.',
    hinglish:
      'Dheere saans lijiye, saans kabhi mat rokiye. Pehli timahi ke baad seedha peeth ke bal mat letiye. Chakkar ya saans phoole to ruk jaaiye. Kripya apne doctor se salaah lein.',
  },

  // Lok geet
  'lok.title': { en: 'Lok Geet shelf', hinglish: 'Lok geet ki almaari' },
  'lok.recordNew': { en: 'Record a song', hinglish: 'Gaana record kijiye' },
  'lok.songName': { en: 'Song name', hinglish: 'Gaane ka naam' },
  'lok.songNamePlaceholder': {
    en: 'e.g. Dadi’s jachcha geet',
    hinglish: 'jaise Dadi ka jachcha geet',
  },
  'lok.familySongs': { en: 'Family songs', hinglish: 'Parivaar ke gaane' },
  'lok.type.lori': { en: 'Lori', hinglish: 'Lori' },
  'lok.type.lokgeet': { en: 'Lok geet', hinglish: 'Lok geet' },
  'lok.type.jachcha': { en: 'Jachcha geet', hinglish: 'Jachcha geet' },
  'lok.singAlong': { en: 'Sing along', hinglish: 'Saath gaaiye' },
  'lok.recordThis': { en: 'Record this song', hinglish: 'Yeh gaana record' },
  'lok.listen': { en: 'Listen', hinglish: 'Suniye' },

  // Karaoke
  'sing.title': { en: 'Sing to baby', hinglish: 'Baby ke liye gaaiye' },
  'sing.pace': { en: 'Pace', hinglish: 'Raftaar' },
  'sing.slow': { en: 'Slow', hinglish: 'Dheere' },
  'sing.normal': { en: 'Normal', hinglish: 'Normal' },
  'sing.start': { en: 'Start singing', hinglish: 'Gaana shuru' },
  'sing.pause': { en: 'Pause', hinglish: 'Rokiye' },
  'sing.music': { en: 'Background music (if available)', hinglish: 'Peeche sangeet (agar ho)' },
  'sing.finished': { en: 'Baby loved that! 🎶', hinglish: 'Baby ko bahut pasand aaya! 🎶' },
  'sing.tapLine': {
    en: 'Tap any line to jump there',
    hinglish: 'Kisi bhi line ko dabaakar wahan jaaiye',
  },
  'sing.noLyrics': {
    en: 'This song has no words written yet. Record it instead!',
    hinglish: 'Is gaane ke shabd abhi likhe nahi. Record kar lijiye!',
  },
} satisfies Record<string, Translation>;
