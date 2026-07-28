import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ChildFormBody } from '@/components/ChildFormBody';
import { useAddChildForm } from '@/hooks/useAddChildForm';
import { colors, fontFamily, fontSize, spacing, textStyle } from '@/theme';

export default function AddChildModal() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const form = useAddChildForm(() => {
    if (router.canGoBack()) {
      router.back();
    }
  });

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.huge },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.closeButton}>{'✕'}</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>{t('onboarding.addChildTitle')}</Text>
      <Text style={styles.subtitle}>{t('onboarding.addChildSubtitle')}</Text>

      <ChildFormBody
        name={form.name}
        onNameChange={form.setName}
        age={form.age}
        onAgeChange={form.setAge}
        error={form.error}
      />

      <Button
        label={t('common.continue')}
        onPress={form.submit}
        loading={form.isPending}
        style={styles.submit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.formX,
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  closeButton: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize['4xl'],
    color: colors.textMuted,
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
  submit: {
    marginTop: spacing.huge,
  },
});
