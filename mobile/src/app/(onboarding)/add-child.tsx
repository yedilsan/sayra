import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ChildFormBody } from '@/components/ChildFormBody';
import { useAddChildForm } from '@/hooks/useAddChildForm';
import { colors, fontFamily, fontSize, spacing, textStyle } from '@/theme';

export default function AddChildScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const form = useAddChildForm();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.huge, paddingBottom: insets.bottom + spacing.huge },
      ]}
      keyboardShouldPersistTaps="handled"
    >
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
    marginTop: 'auto',
    paddingTop: spacing.huge,
  },
});
