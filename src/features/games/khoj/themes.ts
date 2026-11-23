import type { L10n } from '@/lib/content';

export interface KhojTheme {
  id: string;
  emoji: string;
  title: L10n;
  words: { en: string[]; hinglish: string[] };
}

/** Word lists for Shabd Khoj. Words are 3–6 capital letters (they must fit a 6×6 grid). */
export const KHOJ_THEMES: KhojTheme[] = [
  {
    id: 'family',
    emoji: '👨‍👩‍👧',
    title: { en: 'Family', hinglish: 'Parivaar' },
    words: {
      en: ['MOTHER', 'FATHER', 'SISTER', 'NANA', 'NANI', 'AUNT', 'UNCLE', 'BABY'],
      hinglish: ['MAA', 'PAPA', 'DADI', 'DADA', 'NANI', 'BUA', 'MAMA', 'CHACHA'],
    },
  },
  {
    id: 'baby',
    emoji: '👶',
    title: { en: 'Baby things', hinglish: 'Baby ki cheezein' },
    words: {
      en: ['CRADLE', 'RATTLE', 'SONG', 'MILK', 'TOYS', 'SOCKS', 'HUG', 'SLEEP'],
      hinglish: ['LORI', 'PALNA', 'JHULA', 'DOODH', 'GUDIYA', 'TOPI', 'KHEER', 'NEEND'],
    },
  },
  {
    id: 'nature',
    emoji: '🌙',
    title: { en: 'Sky and earth', hinglish: 'Aasmaan aur dharti' },
    words: {
      en: ['MOON', 'STARS', 'SUN', 'RIVER', 'TREE', 'RAIN', 'CLOUD', 'BIRD'],
      hinglish: ['CHAND', 'SURAJ', 'TARE', 'NADI', 'PED', 'BAADAL', 'MOR', 'PHOOL'],
    },
  },
  {
    id: 'village',
    emoji: '🌾',
    title: { en: 'Village life', hinglish: 'Gaon ki zindagi' },
    words: {
      en: ['FARM', 'WHEAT', 'COW', 'WELL', 'FIELD', 'MANGO', 'LASSI', 'SWING'],
      hinglish: ['KHET', 'GEHUN', 'GAAY', 'KUAN', 'LASSI', 'CHURMA', 'SANJHI', 'TEEJ'],
    },
  },
  {
    id: 'heart',
    emoji: '💛',
    title: { en: 'Good feelings', hinglish: 'Achhe bhaav' },
    words: {
      en: ['LOVE', 'HOPE', 'SMILE', 'CALM', 'JOY', 'PEACE', 'KIND', 'BRAVE'],
      hinglish: ['PYAAR', 'KHUSHI', 'SHANTI', 'HIMMAT', 'DAYA', 'SACH', 'ASHA', 'SEVA'],
    },
  },
];
