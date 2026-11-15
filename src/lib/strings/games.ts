import type { Translation } from '../i18n';

/** Play tab, GameShell, and all 11 games. */
export const gameStrings = {
  // Play tab
  'play.title': { en: 'Play', hinglish: 'Khel' },
  'play.subtitle': {
    en: '1–3 minutes each. No losing, only smiles.',
    hinglish: 'Har khel 1–3 minute ka. Haarna nahi, bas muskaan.',
  },
  'play.gameOfDay': { en: 'Game of the day', hinglish: 'Aaj ka khel' },
  'play.allGames': { en: 'All games', hinglish: 'Saare khel' },
  'play.musicCorner': { en: 'Music corner', hinglish: 'Sangeet kona' },
  'play.musicText': {
    en: 'Ragas, mantras, breathing, lok geet and lullabies',
    hinglish: 'Raag, mantra, saans, lok geet aur loriyan',
  },
  'play.storiesText': {
    en: 'Replay any story you have unlocked',
    hinglish: 'Koi bhi khuli kahani dobaara suniye',
  },
  'play.played': { en: 'Played {count}×', hinglish: '{count} baar khela' },

  // Game names + blurbs
  'game.memory.name': { en: 'Memory Match', hinglish: 'Jodi Milao' },
  'game.memory.blurb': {
    en: 'Flip pastel cards to find pairs',
    hinglish: 'Card palat kar jodi dhoondhiye',
  },
  'game.bubbleMaths.name': { en: 'Bubble Maths', hinglish: 'Bulbule ka Ganit' },
  'game.bubbleMaths.blurb': {
    en: 'A Vedic maths trick, then pop the right bubble',
    hinglish: 'Vedic ganit ki trick, phir sahi bulbula phodiye',
  },
  'game.storyQuiz.name': { en: 'Story Quiz Swipe', hinglish: 'Kahani Quiz Swipe' },
  'game.storyQuiz.blurb': {
    en: 'True or false about yesterday’s story',
    hinglish: 'Kal ki kahani: sach ya jhooth',
  },
  'game.wordGarden.name': { en: 'Word Garden', hinglish: 'Shabd Bagicha' },
  'game.wordGarden.blurb': {
    en: 'Spell a word from the story, grow a flower',
    hinglish: 'Kahani ka shabd banaaiye, phool ugaaiye',
  },
  'game.babySize.name': { en: 'Baby Size Guess', hinglish: 'Baby Kitna Bada?' },
  'game.babySize.blurb': {
    en: 'Which fruit is baby this week?',
    hinglish: 'Is hafte baby kaun sa phal jitna hai?',
  },
  'game.paheli.name': { en: 'Paheli of the Day', hinglish: 'Aaj ki Paheli' },
  'game.paheli.blurb': {
    en: 'A riddle with a scratch-card reveal',
    hinglish: 'Paheli, khurach kar jawaab dekhiye',
  },
  'game.sudoku.name': { en: 'Mini Sudoku', hinglish: 'Mini Sudoku' },
  'game.sudoku.blurb': {
    en: 'A gentle 4×4 or 6×6 number puzzle',
    hinglish: 'Aasaan 4×4 ya 6×6 ankon ki paheli',
  },
  'game.patterns.name': { en: 'Number Patterns', hinglish: 'Ankon ka Kram' },
  'game.patterns.blurb': { en: 'What comes next?', hinglish: 'Aage kya aayega?' },
  'game.rangoli.name': { en: 'Rangoli Tap', hinglish: 'Rangoli Banaao' },
  'game.rangoli.blurb': {
    en: 'Tap the glowing dots to draw a rangoli',
    hinglish: 'Chamakte bindu dabaakar rangoli banaaiye',
  },
  'game.sanjhi.name': { en: 'Sanjhi Decorator', hinglish: 'Sanjhi Sajaao' },
  'game.sanjhi.blurb': {
    en: 'Decorate a Haryanvi Sanjhi and save it',
    hinglish: 'Haryanvi Sanjhi sajaaiye aur save kijiye',
  },
  'game.shlokaFill.name': { en: 'Shloka Fill-in', hinglish: 'Shloka Poora Karo' },
  'game.shlokaFill.blurb': { en: 'Find the missing word', hinglish: 'Chhoota shabd dhoondhiye' },

  // GameShell
  'shell.howTo': { en: 'How to play', hinglish: 'Kaise khelein' },
  'shell.hint': { en: 'Hint', hinglish: 'Sanket' },
  'shell.start': { en: 'Start', hinglish: 'Shuru' },
  'shell.finishTitle': { en: 'Shabaash! 🌸', hinglish: 'Shabaash! 🌸' },
  'shell.finishText': {
    en: 'A flower has bloomed in baby’s garden.',
    hinglish: 'Baby ke bagiche mein ek phool khil gaya.',
  },
  'shell.playAgain': { en: 'Play again', hinglish: 'Phir khelein' },
  'shell.done': { en: 'Done', hinglish: 'Ho gaya' },
  'shell.timer': { en: '{sec}s', hinglish: '{sec} sec' },
  'shell.niceTry': { en: 'Almost! Try another one 💛', hinglish: 'Bas thoda sa! Ek aur try 💛' },
  'shell.notFound': { en: 'This game isn’t available.', hinglish: 'Yeh khel uplabdh nahi hai.' },

  // Memory
  'memory.how': {
    en: 'Tap two cards to flip them. If they match, they stay open. Find all the pairs. There is no time limit.',
    hinglish:
      'Do card dabaakar palatiye. Jodi mile to khule rahenge. Saari jodiyan dhoondhiye. Koi samay seema nahi.',
  },
  'memory.hintText': {
    en: 'One pair is wiggling for you 👀',
    hinglish: 'Ek jodi aapke liye hil rahi hai 👀',
  },
  'memory.pairs': { en: '{found} of {total} pairs', hinglish: '{found} / {total} jodiyan' },
  'memory.card': { en: 'Card {n}', hinglish: 'Card {n}' },
  'memory.level': { en: 'Level {level}', hinglish: 'Level {level}' },

  // Bubble maths
  'bubble.how': {
    en: 'First learn a quick Vedic maths trick. Then pop the bubble with the right answer. Wrong bubbles just float away.',
    hinglish:
      'Pehle ek chhoti Vedic ganit trick seekhiye. Phir sahi jawaab wala bulbula phodiye. Galat bulbule bas ud jaate hain.',
  },
  'bubble.trickTitle': { en: 'Trick of the day', hinglish: 'Aaj ki trick' },
  'bubble.nextStep': { en: 'Next step', hinglish: 'Agla kadam' },
  'bubble.letsPlay': { en: 'Let’s play!', hinglish: 'Chalo khelein!' },
  'bubble.question': { en: 'Question {n} of {total}', hinglish: 'Sawaal {n} / {total}' },
  'bubble.hintText': { en: 'Use the trick: {hint}', hinglish: 'Trick lagaaiye: {hint}' },
  'bubble.answer': { en: 'Answer {value}', hinglish: 'Jawaab {value}' },

  // Story quiz
  'quiz.how': {
    en: 'Swipe right for true, left for false. Or use the buttons.',
    hinglish: 'Sach ke liye daayein, jhooth ke liye baayein swipe kijiye. Ya button dabaaiye.',
  },
  'quiz.true': { en: 'True 👍', hinglish: 'Sach 👍' },
  'quiz.false': { en: 'False 👎', hinglish: 'Jhooth 👎' },
  'quiz.right': { en: 'Yes! ✨', hinglish: 'Haan! ✨' },
  'quiz.gentle': {
    en: 'Not quite. The answer is {answer}.',
    hinglish: 'Bilkul nahi. Jawaab hai {answer}.',
  },
  'quiz.about': { en: 'About: {title}', hinglish: 'Kahani: {title}' },
  'quiz.noStory': {
    en: 'Hear a story first, and come back for the quiz!',
    hinglish: 'Pehle ek kahani suniye, phir quiz ke liye aaiye!',
  },

  // Word garden
  'word.how': {
    en: 'Tap the letters in order to spell the word. Tap a letter in the word to send it back. Each word grows a flower.',
    hinglish:
      'Akshar kram se dabaakar shabd banaaiye. Galat akshar wapas bhejne ke liye use dabaaiye. Har shabd ek phool ugaata hai.',
  },
  'word.clue': { en: 'A word from “{title}”', hinglish: '“{title}” ka ek shabd' },
  'word.hintText': {
    en: 'The next letter is glowing ✨',
    hinglish: 'Agla akshar chamak raha hai ✨',
  },
  'word.grown': { en: '{count} flowers grown', hinglish: '{count} phool uge' },
  'word.letter': { en: 'Letter {letter}', hinglish: 'Akshar {letter}' },
  'word.clear': { en: 'Clear', hinglish: 'Saaf' },

  // Baby size guess
  'sizeGuess.how': {
    en: 'Guess which one is closer to baby’s size this week, then see the cute reveal.',
    hinglish: 'Andaaza lagaaiye is hafte baby kis jitna bada hai, phir pyaara jawaab dekhiye.',
  },
  'sizeGuess.question': {
    en: 'This week, is baby the size of…',
    hinglish: 'Is hafte baby kitna bada hai…',
  },
  'sizeGuess.or': { en: 'or', hinglish: 'ya' },
  'sizeGuess.reveal': {
    en: 'Baby is about the size of a {name}! {emoji}',
    hinglish: 'Baby lagbhag {name} jitna hai! {emoji}',
  },

  // Paheli
  'paheli.how': {
    en: 'Read the riddle, think, then scratch the card to see the answer.',
    hinglish: 'Paheli padhiye, sochiye, phir card khurach kar jawaab dekhiye.',
  },
  'paheli.scratch': { en: 'Scratch here ✨', hinglish: 'Yahan khurachiye ✨' },
  'paheli.reveal': { en: 'Show the answer', hinglish: 'Jawaab dikhaaiye' },
  'paheli.hintText': {
    en: 'It starts with “{letter}”',
    hinglish: 'Yeh “{letter}” se shuru hota hai',
  },

  // Sudoku
  'sudoku.how': {
    en: 'Fill the grid so each row, column and box has every number once. Tap a square, then a number. Soft colours show a clash.',
    hinglish:
      'Har line, column aur dabbe mein har ank ek baar aaye. Khaana dabaaiye, phir ank. Halka rang takraav dikhaata hai.',
  },
  'sudoku.cell': { en: 'Row {r}, column {c}', hinglish: 'Line {r}, column {c}' },
  'sudoku.pencil': { en: 'Pencil marks', hinglish: 'Pencil nishaan' },
  'sudoku.erase': { en: 'Erase', hinglish: 'Mitaao' },
  'sudoku.size4': { en: '4×4', hinglish: '4×4' },
  'sudoku.size6': { en: '6×6', hinglish: '6×6' },
  'sudoku.hintText': {
    en: 'One square has been filled in for you.',
    hinglish: 'Ek khaana aapke liye bhar diya.',
  },

  // Patterns
  'patterns.how': {
    en: 'Look at the numbers and pick what comes next. Hints are always free.',
    hinglish: 'Ankon ko dekhiye aur agla chuniye. Sanket hamesha muft hain.',
  },
  'patterns.question': { en: 'What comes next?', hinglish: 'Aage kya aayega?' },

  // Rangoli
  'rangoli.how': {
    en: 'Tap the glowing dot to draw the next line. There are no wrong moves; the next dot will always glow for you.',
    hinglish:
      'Chamakta bindu dabaakar agli line banaaiye. Koi galti nahi hoti; agla bindu hamesha chamkega.',
  },
  'rangoli.dot': { en: 'Dot {n}', hinglish: 'Bindu {n}' },
  'rangoli.progress': { en: '{done} of {total} lines', hinglish: '{done} / {total} line' },
  'rangoli.colour': { en: 'Colour', hinglish: 'Rang' },

  // Sanjhi
  'sanjhi.how': {
    en: 'Tap a sticker to add it, then drag it anywhere. Save your Sanjhi to your gallery when you love it.',
    hinglish:
      'Sticker dabaakar jodiye, phir kahin bhi khiskaaiye. Pasand aaye to Sanjhi gallery mein save kijiye.',
  },
  'sanjhi.save': { en: 'Save my Sanjhi', hinglish: 'Meri Sanjhi save' },
  'sanjhi.saved': { en: 'Saved to your gallery 🌺', hinglish: 'Gallery mein save ho gayi 🌺' },
  'sanjhi.download': { en: 'Download image', hinglish: 'Photo download' },
  'sanjhi.clear': { en: 'Start fresh', hinglish: 'Naye sire se' },
  'sanjhi.sticker': { en: 'Add {name}', hinglish: '{name} jodiye' },
  'sanjhi.about': {
    en: 'Sanjhi is a Haryanvi Navratri tradition: a goddess face and stars made of clay on the wall.',
    hinglish:
      'Sanjhi Haryana ki Navratri parampara hai: deewar par mitti ka Devi ka chehra aur sitaare.',
  },
  'sanjhi.hintText': {
    en: 'Try stars around the face and flowers below 🌼',
    hinglish: 'Chehre ke aas-paas sitaare aur neeche phool lagaaiye 🌼',
  },
  'sanjhi.canvas': { en: 'Your Sanjhi canvas', hinglish: 'Aapki Sanjhi' },

  // Shloka fill
  'fill.how': {
    en: 'A word is missing from a shloka. Tap the right one to complete it.',
    hinglish: 'Shloke ka ek shabd chhoot gaya. Sahi shabd dabaakar poora kijiye.',
  },
  'fill.hintText': { en: 'Meaning: {meaning}', hinglish: 'Arth: {meaning}' },
} satisfies Record<string, Translation>;
