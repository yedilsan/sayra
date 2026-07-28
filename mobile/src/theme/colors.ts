export const colors = {
  background: '#FBF8F2',
  backgroundAlt: '#EDEAE2',
  card: '#FFFFFF',
  cardAlt: '#F9F7F1',

  text: '#262A33',
  textMuted: '#6B7280',
  textFaint: '#9B9585',
  placeholder: '#B9B3A2',

  border: '#E7E3D8',
  borderLight: '#F0EEE7',
  chipInactiveBg: '#F5F3EC',
  disabled: '#D9D4C6',
  barEmpty: '#EFEBE0',

  error: '#C4573D',
  white: '#FFFFFF',
  black: '#000000',
  scrim: 'rgba(38,42,51,0.35)',

  tabs: {
    aac: '#3AA6A0',
    exercises: '#8C86D6',
    pronunciation: '#E8935F',
    therapists: '#6FA37A',
    profile: '#5B8DBE',
  },

  tint: {
    teal: { bg: '#DCEEEC', text: '#1F7A75' },
    purple: { bg: '#E7E5F7', text: '#5B4FA8', textAlt: '#7A72C4' },
    orange: { bg: '#FBE7D8', text: '#B5713D' },
    green: { bg: '#E3EFE4', text: '#4E7A57' },
    blue: { bg: '#E3ECF4', text: '#1F4A66', textAlt: '#4A6E8A' },
  },

  gradient: ['#3AA6A0', '#8C86D6'] as [string, string],
} as const;

export type Colors = typeof colors;
