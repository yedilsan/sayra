import type { ViewStyle } from 'react-native';

/**
 * `boxShadow` replaces the deprecated `shadow*` props in React Native 0.86 and works
 * across iOS/Android/web. `elevation` stays for older Android rendering paths.
 */
export const shadows = {
  card: {
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  } satisfies ViewStyle,

  floatingButton: {
    boxShadow: '0px 6px 16px rgba(60, 60, 90, 0.28)',
    elevation: 8,
  } satisfies ViewStyle,
} as const;
