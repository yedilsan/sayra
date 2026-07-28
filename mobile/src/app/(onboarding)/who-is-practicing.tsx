import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AvatarCircle } from '@/components/AvatarCircle';
import { useChildren } from '@/hooks/useChildren';
import { useChildStore } from '@/store/child-store';
import { colors, fontFamily, fontSize, radii, shadows, spacing, textStyle } from '@/theme';

export default function WhoIsPracticingScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const childrenQuery = useChildren();
  const setActiveChildId = useChildStore((state) => state.setActiveChildId);

  const children = childrenQuery.data ?? [];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.huge, paddingBottom: insets.bottom + spacing.huge },
      ]}
    >
      <Text style={styles.title}>{t('onboarding.whoIsPracticingTitle')}</Text>
      <Text style={styles.subtitle}>{t('onboarding.whoIsPracticingSubtitle')}</Text>

      <View style={styles.list}>
        {children.map((child) => (
          <Pressable
            key={child.id}
            onPress={() => setActiveChildId(child.id)}
            style={styles.card}
          >
            <AvatarCircle id={child.id} name={child.name} photoUrl={child.avatarUrl} size={48} />
            <View style={styles.cardText}>
              <Text style={styles.cardName}>{child.name}</Text>
              <Text style={styles.cardMeta}>{t('onboarding.ageLabel', { age: child.age })}</Text>
            </View>
            <Text style={styles.chevron}>{'›'}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => router.push('/children/new')}
        style={styles.addButton}
      >
        <Text style={styles.addButtonLabel}>{t('onboarding.addAnotherChild')}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.formX,
  },
  title: {
    ...textStyle('black', fontSize['7xl']),
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.huge,
  },
  list: {
    gap: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    gap: spacing.xxl,
    ...shadows.card,
  },
  cardText: {
    flex: 1,
  },
  cardName: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.text,
  },
  cardMeta: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['5xl'],
    color: colors.placeholder,
  },
  addButton: {
    marginTop: spacing.huge,
    height: 56,
    borderRadius: radii.xxl,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textMuted,
  },
});
