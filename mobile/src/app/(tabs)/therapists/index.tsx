import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AvatarCircle } from '@/components/AvatarCircle';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { useSpecialists } from '@/hooks/useSpecialists';
import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/theme';
import type { Specialist } from '@/types';

function matchesQuery(specialist: Specialist, query: string): boolean {
  const haystack = [specialist.name, specialist.city ?? '', ...specialist.specializations]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export default function TherapistsScreen() {
  const { t } = useTranslation();
  const specialistsQuery = useSpecialists();

  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState<string | null>(null);

  const specialists = specialistsQuery.data ?? [];

  const specialties = useMemo(() => {
    const unique = new Set<string>();
    specialists.forEach((specialist) => {
      specialist.specializations.forEach((item) => unique.add(item));
    });
    return Array.from(unique).sort();
  }, [specialists]);

  const filtered = useMemo(
    () =>
      specialists.filter((specialist) => {
        const queryOk = !query.trim() || matchesQuery(specialist, query.trim());
        const specialtyOk = !specialty || specialist.specializations.includes(specialty);
        return queryOk && specialtyOk;
      }),
    [specialists, query, specialty],
  );

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t('therapists.title')}</Text>
      <Text style={styles.subtitle}>{t('therapists.subtitle')}</Text>

      <TextField
        value={query}
        onChangeText={setQuery}
        placeholder={t('therapists.searchPlaceholder')}
        autoCapitalize="none"
        style={styles.search}
      />

      {specialties.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
          style={styles.chipScroll}
        >
          {specialties.map((item) => {
            const active = specialty === item;
            return (
              <Pressable
                key={item}
                onPress={() => setSpecialty(active ? null : item)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{item}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      ) : null}

      {specialistsQuery.isPending ? (
        <ActivityIndicator color={colors.textMuted} style={styles.loader} />
      ) : specialistsQuery.isError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{t('common.somethingWentWrong')}</Text>
          <Button label={t('common.retry')} onPress={() => void specialistsQuery.refetch()} />
        </View>
      ) : filtered.length === 0 ? (
        <Text style={styles.emptyText}>{t('therapists.noResults')}</Text>
      ) : (
        <View style={styles.list}>
          {filtered.map((specialist) => (
            <View key={specialist.id} style={styles.card}>
              {specialist.photoUrl ? (
                <Image source={{ uri: specialist.photoUrl }} style={styles.photo} contentFit="cover" />
              ) : (
                <AvatarCircle id={specialist.id} name={specialist.name} size={46} />
              )}

              <View style={styles.cardText}>
                <Text style={styles.cardName}>{specialist.name}</Text>
                <Text style={styles.cardMeta} numberOfLines={1}>
                  {[specialist.specializations.join(', '), specialist.city]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
                {specialist.bio ? (
                  <Text style={styles.cardBio} numberOfLines={2}>
                    {specialist.bio}
                  </Text>
                ) : null}
                {specialist.phone ? <Text style={styles.cardPhone}>{specialist.phone}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.screenX,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.huge,
  },
  title: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['7xl'],
    color: colors.text,
  },
  subtitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: spacing.xxl,
  },
  search: {
    marginBottom: spacing.lg,
  },
  chipScroll: {
    flexGrow: 0,
    marginBottom: spacing.xxl,
    marginHorizontal: -spacing.screenX,
  },
  chipRow: {
    gap: spacing.sm,
    paddingHorizontal: spacing.screenX,
    // Without this the chips stretch to the ScrollView's full cross-axis height.
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.card,
    ...shadows.card,
  },
  chipActive: {
    backgroundColor: colors.tabs.therapists,
  },
  chipLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.md,
    color: colors.text,
  },
  chipLabelActive: {
    color: colors.white,
  },
  loader: {
    marginTop: spacing.huge,
  },
  errorBox: {
    gap: spacing.xxl,
    marginTop: spacing.huge,
  },
  errorText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xl,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.huge,
  },
  list: {
    gap: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    gap: spacing.xl,
    ...shadows.card,
  },
  photo: {
    width: 46,
    height: 46,
    borderRadius: radii.circle,
    backgroundColor: colors.borderLight,
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
  cardBio: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.textFaint,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  cardPhone: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.md,
    color: colors.tabs.therapists,
    marginTop: spacing.xs,
  },
});
