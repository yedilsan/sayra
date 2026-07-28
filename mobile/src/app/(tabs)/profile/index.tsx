import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import * as usersApi from '@/api/users';
import { AvatarCircle } from '@/components/AvatarCircle';
import { Button } from '@/components/Button';
import { SegmentedControl } from '@/components/SegmentedControl';
import { SettingsToggle } from '@/components/SettingsToggle';
import { TextField } from '@/components/TextField';
import { WeeklyBarChart } from '@/components/WeeklyBarChart';
import { useChildren } from '@/hooks/useChildren';
import { useLogout } from '@/hooks/useLogout';
import { useProgressSessions, useProgressSummary } from '@/hooks/useProgress';
import { SUPPORTED_LANGS } from '@/i18n';
import { useAuthStore } from '@/store/auth-store';
import { useChildStore } from '@/store/child-store';
import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/theme';
import type { Lang } from '@/types';
import { bucketSessionsByWeekday, formatPracticeTime } from '@/utils/weekly-activity';

const LANG_ACCENT: Record<Lang, string> = {
  RU: colors.tabs.pronunciation,
  KZ: colors.tabs.exercises,
  JA: colors.tabs.profile,
  EN: colors.tabs.aac,
};

export default function ProfileScreen() {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const activeChildId = useChildStore((state) => state.activeChildId);
  const setActiveChildId = useChildStore((state) => state.setActiveChildId);
  const logout = useLogout();

  const childrenQuery = useChildren();
  const summaryQuery = useProgressSummary(activeChildId);
  const sessionsQuery = useProgressSessions(activeChildId);

  const [name, setName] = useState(user?.name ?? '');
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const updateMe = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: (updated) => updateUser(updated),
  });

  const children = childrenQuery.data ?? [];
  const activeChild = children.find((child) => child.id === activeChildId);
  const buckets = useMemo(
    () => bucketSessionsByWeekday(sessionsQuery.data ?? []),
    [sessionsQuery.data],
  );

  const summary = summaryQuery.data;
  const nameChanged = name.trim().length > 0 && name.trim() !== user?.name;

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{t('profile.title')}</Text>

      {/* Parent header */}
      <View style={styles.headerRow}>
        <AvatarCircle id={user?.id ?? 'parent'} name={user?.name ?? '?'} photoUrl={user?.avatarUrl} size={52} />
        <View style={styles.headerText}>
          <Text style={styles.headerName}>{user?.name}</Text>
          <Text style={styles.headerEmail}>{user?.email}</Text>
        </View>
      </View>

      <TextField
        value={name}
        onChangeText={setName}
        placeholder={t('profile.editName')}
        autoCapitalize="words"
      />
      {nameChanged ? (
        <Button
          label={t('profile.saveName')}
          onPress={() => updateMe.mutate({ name: name.trim() })}
          loading={updateMe.isPending}
          style={styles.saveNameButton}
        />
      ) : null}

      {/* Language */}
      <Text style={styles.sectionLabel}>{t('profile.interfaceLanguage')}</Text>
      <View style={styles.langRow}>
        {SUPPORTED_LANGS.map((lang) => {
          const active = user?.language === lang;
          return (
            <Pressable
              key={lang}
              onPress={() => updateMe.mutate({ language: lang })}
              style={[styles.langChip, active && { backgroundColor: LANG_ACCENT[lang] }]}
            >
              <Text style={[styles.langChipLabel, active && styles.langChipLabelActive]}>{lang}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.divider} />

      {/* Children */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>{t('profile.myChildren')}</Text>
        <Pressable onPress={() => router.push('/children/new')} hitSlop={8}>
          <Text style={styles.sectionAction}>{t('profile.addChild')}</Text>
        </Pressable>
      </View>

      <View style={styles.childList}>
        {children.map((child) => {
          const active = child.id === activeChildId;
          return (
            <Pressable
              key={child.id}
              onPress={() => setActiveChildId(child.id)}
              style={styles.childCard}
            >
              <AvatarCircle id={child.id} name={child.name} photoUrl={child.avatarUrl} size={44} />
              <View style={styles.childText}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childMeta}>{t('onboarding.ageLabel', { age: child.age })}</Text>
              </View>
              <View style={[styles.badge, active && styles.badgeActive]}>
                <Text style={[styles.badgeLabel, active && styles.badgeLabelActive]}>
                  {active ? t('childSwitch.active') : t('childSwitch.switch')}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.divider} />

      {/* Settings */}
      <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>{t('profile.notifications')}</Text>
          <SettingsToggle value={notificationsOn} onChange={setNotificationsOn} />
        </View>
        <View style={styles.settingsDivider} />
        <View style={styles.settingsRow}>
          <Text style={styles.settingsLabel}>{t('profile.theme')}</Text>
          <View style={styles.themeControl}>
            <SegmentedControl
              value={theme}
              onChange={setTheme}
              options={[
                { label: t('profile.light'), value: 'light' },
                { label: t('profile.dark'), value: 'dark' },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Progress */}
      {activeChild ? (
        <>
          <Text style={styles.sectionTitle}>
            {t('profile.progressTitle', { name: activeChild.name })}
          </Text>

          {summaryQuery.isPending ? (
            <ActivityIndicator color={colors.textMuted} style={styles.loader} />
          ) : (
            <>
              <View style={styles.statRow}>
                <View style={[styles.statTile, { backgroundColor: colors.tint.teal.bg }]}>
                  <Text style={[styles.statValue, { color: colors.tint.teal.text }]}>
                    {summary?.exercisesCompleted ?? 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.tint.teal.text }]}>
                    {t('profile.exercisesDone')}
                  </Text>
                </View>
                <View style={[styles.statTile, { backgroundColor: colors.tint.purple.bg }]}>
                  <Text style={[styles.statValue, { color: colors.tint.purple.text }]}>
                    {formatPracticeTime(summary?.totalPracticeSeconds ?? 0)}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.tint.purple.text }]}>
                    {t('profile.practiceTime')}
                  </Text>
                </View>
              </View>

              <View style={styles.statRow}>
                <View style={[styles.statTile, { backgroundColor: colors.tint.orange.bg }]}>
                  <Text style={[styles.statValue, { color: colors.tint.orange.text }]}>
                    {summary?.pronunciationAttempts ?? 0}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.tint.orange.text }]}>
                    {t('profile.pronunciationAttempts')}
                  </Text>
                </View>
                <View style={[styles.statTile, { backgroundColor: colors.tint.blue.bg }]}>
                  <Text style={[styles.statValue, { color: colors.tint.blue.text }]}>
                    {summary?.averagePronunciationAccuracy != null
                      ? `${summary.averagePronunciationAccuracy}%`
                      : '—'}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.tint.blue.text }]}>
                    {t('profile.avgAccuracy')}
                  </Text>
                </View>
              </View>

              <View style={styles.chartCard}>
                <WeeklyBarChart buckets={buckets} />
              </View>
            </>
          )}
        </>
      ) : null}

      <Button
        label={t('profile.logOut')}
        variant="destructive"
        onPress={() => void logout()}
        style={styles.logoutButton}
      />
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
    marginBottom: spacing.huge,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.xxl,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize['5xl'],
    color: colors.text,
  },
  headerEmail: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
  },
  saveNameButton: {
    marginTop: spacing.lg,
  },
  sectionLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  langRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  langChip: {
    flex: 1,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.chipInactiveBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langChipLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textMuted,
  },
  langChipLabelActive: {
    color: colors.white,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.huge,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['6xl'],
    color: colors.text,
  },
  sectionAction: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.tabs.aac,
  },
  childList: {
    gap: spacing.lg,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    gap: spacing.xl,
    ...shadows.card,
  },
  childText: {
    flex: 1,
  },
  childName: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.text,
  },
  childMeta: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    backgroundColor: colors.borderLight,
  },
  badgeActive: {
    backgroundColor: colors.tint.teal.bg,
  },
  badgeLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.textMuted,
  },
  badgeLabelActive: {
    color: colors.tint.teal.text,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xxl,
    marginTop: spacing.xxl,
    ...shadows.card,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xxl,
    gap: spacing.xl,
  },
  settingsDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xxl,
  },
  settingsLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.text,
  },
  themeControl: {
    width: 160,
  },
  loader: {
    marginTop: spacing.xxl,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xxl,
  },
  statTile: {
    flex: 1,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
  },
  statValue: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['7xl'],
  },
  statLabel: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.md,
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
    marginTop: spacing.xxl,
    ...shadows.card,
  },
  logoutButton: {
    marginTop: spacing.huge * 1.5,
  },
});
