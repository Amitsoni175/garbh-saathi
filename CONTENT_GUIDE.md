# Content guide

How to write stories, prompts and tips for Garbh Saathi. The technical "how to add" steps are in the
[README](README.md#how-to-add-content).

## Tone rules

- **Warm, simple, positive.** Short sentences. Talk the way a loving elder would.
- **No fear.** No scary images, no "if you don't do this…" language. Hard moments in old stories
  (a battle, a loss) are mentioned gently and briefly, and the story moves to the light.
- **No gender preference.** Never predict or hope for a boy or a girl. No "putra prapti" content.
  Use "baby", "laado/laadla" together, or her nickname for the baby. Sex determination is illegal
  in India (PCPNDT Act).
- **No medical promises** and no IQ claims. Frame everything as bonding, calm and joy for the
  mother. Health content always says "Please check with your doctor."
- **Respectful retellings.** Retell scriptures in your own words. Keep facts about real people
  accurate, positive and checkable.
- **Hinglish** should be easy for any Hindi speaker to read, with a light Haryanvi touch in
  greetings and rewards ("Ram Ram ji", "Ghani badhiya!", "Shabaash!").
- **Festivals:** never suggest fasting in pregnancy. Gently point to the doctor instead.

## Story template

| Part                                 | Guideline                                                                                   |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| Cards                                | 5–8 cards, 40–70 words each, about 300–500 words in total with choices, moral and say-lines |
| Card 1                               | Set the scene: who, where, one sensory detail                                               |
| Middle cards                         | One small problem, and how the hero meets it with a good quality                            |
| Choice point (optional, 1 per story) | "What should X do?", 2 options, **both lead to a meaningful lesson** (no wrong answer)      |
| Last card                            | Warm ending + a `say` line the mother can say to her baby                                   |
| Moral                                | One sentence, a positive habit or value                                                     |
| Reflection                           | One open question for the mother, answered by text or voice                                 |
| Quiz                                 | 3–5 true/false statements (used the next day in Story Quiz Swipe)                           |
| Words                                | 3–4 words from the story in CAPITALS for Word Garden                                        |

Example `say` lines:

- "Little one, I know you are listening. I love you."
- "Mere chhote, tum roz ek chhote kadam se bahut kuch seekhoge."

## Prompts

- Talk-to-baby prompts invite her to share **her** world: village, family, food, seasons, memories.
- Papa prompts are short, concrete things to say or do. A tiny story is welcome (the crow and the
  pot, the sparrow and the fire).
- Journal prompts are open and kind. Never "you should…".

## Thoughts of the Day

- `src/content/thoughts.json`: `id`, `emoji`, `source`, `text` and `say`, each with `en` and `hi`
  (Devanagari), plus an optional `original` (the verse in its own words).
- Only use quotes you can check, and name the exact source (chapter and verse, or book). Leave out
  sayings that are only attributed to someone on the internet.
- The `say` line is short and loving, something she can recite to baby.

## Health and wellness tips

- Use `"caution": true` for things to limit (ghee, sweets, chai with meals), and `"askDoctor": true`
  when the family tradition is fine but amounts vary (panjiri, gond laddoos).
- Yoga cards are only for gentle movement and breathing, and always appear with "Only with your
  doctor's approval".
- Have her doctor read the danger signs and wellness tips before relying on them.

## Checklist before adding content

- [ ] Both `en` and `hinglish` are filled in (`hi` Devanagari is a bonus for stories)
- [ ] No fear, no gender preference, no medical promises, no IQ claims
- [ ] Facts about real people are checked
- [ ] Every choice option leads to a positive lesson
- [ ] Quiz answers match the story text
- [ ] `words` are CAPITAL letters only, 2–10 letters
- [ ] IDs are unique, lowercase, with dashes (`gita-4`, `p-kite`)
- [ ] `npm run check` passes, and Debug panel → Content validation report says "All content is valid ✅"
