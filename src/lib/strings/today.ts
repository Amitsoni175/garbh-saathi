import type { Translation } from '../i18n';

/** Onboarding, Today screen, journey path, garden, shloka, talk-to-baby. */
export const todayStrings = {
  // Onboarding
  'onb.welcomeTitle': {
    en: 'Ram Ram ji 🙏 Welcome to Garbh Saathi',
    hinglish: 'Ram Ram ji 🙏 Garbh Saathi mein swagat hai',
  },
  'onb.welcomeText': {
    en: 'A calm little companion for you and your baby: stories, ragas, gentle games and love. Everything stays on this phone.',
    hinglish:
      'Aapke aur baby ke liye ek shaant saathi: kahaniyan, raag, pyaare khel aur dher saara pyaar. Sab kuch isi phone mein rehta hai.',
  },
  'onb.start': { en: 'Let’s begin', hinglish: 'Shuru karein' },
  'onb.datesTitle': { en: 'When did your journey begin?', hinglish: 'Aapka safar kab shuru hua?' },
  'onb.byLmp': { en: 'Last period date', hinglish: 'Last period ki date' },
  'onb.byEdd': { en: 'Due date', hinglish: 'Due date' },
  'onb.lmpLabel': { en: 'First day of your last period', hinglish: 'Last period ka pehla din' },
  'onb.eddLabel': { en: 'Due date from your doctor', hinglish: 'Doctor ki batayi due date' },
  'onb.result': {
    en: 'You are at Week {week} · Day {day}. Baby is due on {edd}',
    hinglish: 'Aap Week {week} · Din {day} par hain. Baby ki due date {edd}',
  },
  'onb.next': { en: 'Next', hinglish: 'Aage' },
  'onb.back': { en: 'Back', hinglish: 'Peeche' },
  'onb.aboutTitle': { en: 'A little about you', hinglish: 'Thoda aapke baare mein' },
  'onb.nameLabel': { en: 'Your name', hinglish: 'Aapka naam' },
  'onb.namePlaceholder': { en: 'e.g. Sukanya', hinglish: 'jaise Sukanya' },
  'onb.nickLabel': {
    en: 'Baby’s nickname (optional)',
    hinglish: 'Baby ka pyaar ka naam (zaroori nahi)',
  },
  'onb.nickPlaceholder': {
    en: 'e.g. Chhotu, Gudiya, Golu',
    hinglish: 'jaise Chhotu, Gudiya, Golu',
  },
  'onb.scheduleHint': {
    en: 'A gentle daily rhythm (morning shloka, tablet, story, game, lullaby) is set up for you. You can change it any time in Me → Schedule.',
    hinglish:
      'Ek pyaari roz ki dinchrya (subah shloka, tablet, kahani, khel, lori) taiyaar hai. Me → Schedule mein kabhi bhi badal sakti hain.',
  },
  'onb.finish': { en: 'Start my journey 🌸', hinglish: 'Mera safar shuru karein 🌸' },
  'onb.skip': { en: 'Skip for now', hinglish: 'Abhi chhodein' },
  'onb.stepOf': { en: 'Step {step} of 3', hinglish: 'Kadam {step} / 3' },

  // Today header
  'hello.morning': { en: 'Good morning, {name} 🌅', hinglish: 'Ram Ram {name} ji! Suprabhat 🌅' },
  'hello.afternoon': {
    en: 'Good afternoon, {name} ☀️',
    hinglish: 'Ram Ram {name} ji! Aaj ke haal sai? ☀️',
  },
  'hello.evening': {
    en: 'Good evening, {name} 🌇',
    hinglish: 'Ram Ram {name} ji! Shaam ki ram-ram 🌇',
  },
  'hello.night': { en: 'Good night, {name} 🌙', hinglish: 'Ram Ram {name} ji! Aaraam karo 🌙' },
  'today.defaultName': { en: 'Mummy', hinglish: 'Mummy' },
  'today.weekDay': { en: 'Week {week} · Day {day}', hinglish: 'Week {week} · Din {day}' },
  'today.daysToGo': { en: '{days} days to go', hinglish: '{days} din baaki' },
  'today.progressLabel': { en: '{percent}% of the journey', hinglish: 'Safar ka {percent}%' },
  'today.trimester': { en: 'Trimester {tri}', hinglish: 'Timahi {tri}' },
  'today.refreshing': { en: 'Refreshing…', hinglish: 'Taaza ho raha hai…' },
  'today.pullHint': { en: 'Release to refresh', hinglish: 'Chhodiye, taaza hoga' },

  // Baby size
  'size.title': {
    en: 'This week, baby is about the size of',
    hinglish: 'Is hafte baby lagbhag itna bada hai',
  },
  'size.measure': { en: 'About {cm} cm · {weight}', hinglish: 'Lagbhag {cm} cm · {weight}' },
  'size.grams': { en: '{g} g', hinglish: '{g} gram' },
  'size.kg': { en: '{kg} kg', hinglish: '{kg} kilo' },
  'size.lessThanGram': { en: 'less than 1 g', hinglish: '1 gram se kam' },
  'size.approx': {
    en: 'Every baby grows at their own pace. These are rough averages.',
    hinglish: 'Har baby apni raftaar se badhta hai. Yeh andaaze hain.',
  },

  // Stages
  'stage.anyDayTitle': { en: 'Any day now 💛', hinglish: 'Ab kabhi bhi 💛' },
  'stage.anyDayText': {
    en: 'You have reached your due date. Rest, stay close to family, and keep your hospital bag ready. Call your doctor if anything feels different.',
    hinglish:
      'Due date aa gayi. Aaraam kijiye, parivaar ke paas rahiye, aur hospital ka bag taiyaar rakhiye. Kuch alag lage to doctor ko phone kijiye.',
  },
  'stage.overdueTitle': {
    en: 'Has your little one arrived?',
    hinglish: 'Kya aapka nanha mehmaan aa gaya?',
  },
  'stage.overdueText': {
    en: 'You are past 42 weeks. If baby hasn’t arrived yet, please talk to your doctor today.',
    hinglish: '42 hafte poore ho gaye. Agar baby abhi nahi aaya, to aaj hi doctor se baat kijiye.',
  },
  'stage.arrived': { en: 'Yes, baby is here! 🎉', hinglish: 'Haan, baby aa gaya! 🎉' },
  'stage.earlyText': {
    en: 'Your due date puts today just before your journey begins. The path starts in a few days.',
    hinglish: 'Aapki due date ke hisaab se safar kuch din baad shuru hoga.',
  },

  // Journey
  'journey.title': { en: 'Today’s Journey', hinglish: 'Aaj ki yatra' },
  'journey.subtitle': {
    en: 'Five small moments, in any order',
    hinglish: 'Paanch chhote pal, kisi bhi kram mein',
  },
  'journey.shloka': { en: 'Shloka', hinglish: 'Shloka' },
  'journey.story': { en: 'Story', hinglish: 'Kahani' },
  'journey.game': { en: 'Game', hinglish: 'Khel' },
  'journey.raga': { en: 'Raga', hinglish: 'Raag' },
  'journey.talk': { en: 'Talk to baby', hinglish: 'Baby se baat' },
  'journey.done': { en: 'done', hinglish: 'ho gaya' },
  'journey.stoneLabel': { en: '{name}: {title}', hinglish: '{name}: {title}' },
  'journey.allDoneTitle': {
    en: 'Ghani badhiya! All five done 🌸',
    hinglish: 'Ghani badhiya! Paanchon ho gaye 🌸',
  },
  'journey.allDoneText': {
    en: 'Your little one heard a shloka, a story, a raga and your voice today. What a lovely day together.',
    hinglish:
      'Aaj baby ne shloka, kahani, raag aur aapki awaaz suni. Kitna pyaara din bitaaya saath mein.',
  },
  'journey.flowerAdded': {
    en: 'A flower bloomed in baby’s garden 🌸',
    hinglish: 'Baby ke bagiche mein ek phool khila 🌸',
  },

  // Seasonal tip card
  'tip.ofTheDay': { en: 'Tip for today', hinglish: 'Aaj ki salaah' },
  'tip.checkDoctor': {
    en: 'Please check with your doctor.',
    hinglish: 'Kripya apne doctor se salaah lein.',
  },

  // Garden
  'garden.title': { en: 'Garden for Baby', hinglish: 'Baby ka bagicha' },
  'garden.subtitle': { en: '{count} flowers so far', hinglish: 'Ab tak {count} phool' },
  'garden.empty': {
    en: 'A seed is waiting. Do any little activity to plant your first flower.',
    hinglish: 'Ek beej intezaar kar raha hai. Koi bhi chhota kaam kijiye, pehla phool lagega.',
  },
  'garden.weekSummary': {
    en: 'This week: {stories} stories, {games} games, {letters} letters 💛',
    hinglish: 'Is hafte: {stories} kahaniyan, {games} khel, {letters} chitthiyan 💛',
  },
  'garden.otherSummary': {
    en: 'Plus {other} other little moments of care.',
    hinglish: 'Aur {other} pyaare pal dekhbhaal ke.',
  },
  'garden.milestones': { en: 'Special visitors', hinglish: 'Khaas mehmaan' },
  'garden.festivals': { en: 'Festival treasures', hinglish: 'Tyohaar ke khazaane' },
  'garden.neverShrinks': {
    en: 'Your garden only grows. It never wilts. 🌱',
    hinglish: 'Aapka bagicha sirf badhta hai. Kabhi murjhaata nahi. 🌱',
  },
  'garden.open': { en: 'Open the garden', hinglish: 'Bagicha kholiye' },
  'garden.stage.seed': { en: 'A little seed', hinglish: 'Nanha beej' },
  'garden.stage.sprout': { en: 'A tiny sprout', hinglish: 'Nanha ankur' },
  'garden.stage.sapling': { en: 'A young plant', hinglish: 'Chhota paudha' },
  'garden.stage.young': { en: 'A growing plant', hinglish: 'Badhta paudha' },
  'garden.stage.tree': { en: 'A strong tree', hinglish: 'Majboot ped' },
  'garden.stage.bloom': { en: 'A tree in full bloom', hinglish: 'Phoolon se bhara ped' },

  // Shloka activity
  'shloka.title': { en: 'Morning shloka', hinglish: 'Subah ka shloka' },
  'shloka.listen': { en: 'Listen', hinglish: 'Suniye' },
  'shloka.showTranslit': { en: 'Show pronunciation', hinglish: 'Uchchaaran dikhaayein' },
  'shloka.meaning': { en: 'Meaning', hinglish: 'Arth' },
  'shloka.sayIt': {
    en: 'Say it slowly with your hand on your belly.',
    hinglish: 'Pet par haath rakhkar dheere-dheere boliye.',
  },
  'shloka.done': { en: 'I said it 🙏', hinglish: 'Maine bola 🙏' },
  'shloka.notFound': {
    en: 'This shloka isn’t available.',
    hinglish: 'Yeh shloka uplabdh nahi hai.',
  },

  // Talk to baby
  'talk.title': { en: 'Talk to baby', hinglish: 'Baby se baat' },
  'talk.promptOfDay': { en: 'Today’s idea', hinglish: 'Aaj ka idea' },
  'talk.howTo': {
    en: 'Sit comfortably, rest your hands on your belly, and speak in your own words. Baby loves your voice.',
    hinglish:
      'Aaraam se baithiye, pet par haath rakhiye, aur apne shabdon mein boliye. Baby ko aapki awaaz bahut pyaari lagti hai.',
  },
  'talk.record': { en: 'Record it (optional)', hinglish: 'Record kijiye (zaroori nahi)' },
  'talk.done': { en: 'I talked to baby 💛', hinglish: 'Maine baby se baat ki 💛' },
  'talk.another': { en: 'Another idea', hinglish: 'Doosra idea' },
  'talk.saved': {
    en: 'Saved to your letters 💌',
    hinglish: 'Aapki chitthiyon mein save ho gaya 💌',
  },
} satisfies Record<string, Translation>;
