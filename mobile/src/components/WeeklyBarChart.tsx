import { StyleSheet, Text, View } from 'react-native';

import { colors, fontFamily, fontSize, spacing } from '@/theme';
import type { WeekdayBucket } from '@/utils/weekly-activity';

const MAX_BAR_HEIGHT = 52;
const MIN_BAR_HEIGHT = 6;

export function WeeklyBarChart({ buckets }: { buckets: WeekdayBucket[] }) {
  const max = Math.max(...buckets.map((bucket) => bucket.count), 1);

  return (
    <View style={styles.row}>
      {buckets.map((bucket) => {
        const height =
          bucket.count > 0
            ? Math.max(MIN_BAR_HEIGHT, Math.round((bucket.count / max) * MAX_BAR_HEIGHT))
            : MIN_BAR_HEIGHT;
        return (
          <View key={bucket.offset} style={styles.column}>
            <View
              style={[
                styles.bar,
                { height, backgroundColor: bucket.count > 0 ? colors.tabs.exercises : colors.barEmpty },
              ]}
            />
            <Text style={styles.label}>{bucket.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: MAX_BAR_HEIGHT + 24,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  bar: {
    width: '60%',
    borderRadius: 4,
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: colors.textFaint,
  },
});
