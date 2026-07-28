import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AvatarCircle } from '@/components/AvatarCircle';
import { TextField } from '@/components/TextField';
import { colors, fontFamily, fontSize, radii, spacing } from '@/theme';

const AGE_OPTIONS = [2, 3, 4, 5, 6];

interface ChildFormBodyProps {
  name: string;
  onNameChange: (value: string) => void;
  age: number | null;
  onAgeChange: (value: number) => void;
  error: string | null;
}

export function ChildFormBody({ name, onNameChange, age, onAgeChange, error }: ChildFormBodyProps) {
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.avatarPreview}>
        <AvatarCircle id={name || 'placeholder'} name={name || '?'} size={72} />
      </View>

      <TextField
        value={name}
        onChangeText={onNameChange}
        placeholder={t('onboarding.namePlaceholder')}
        autoCapitalize="words"
        style={styles.nameField}
      />

      <Text style={styles.sectionLabel}>{t('onboarding.age')}</Text>
      <View style={styles.ageRow}>
        {AGE_OPTIONS.map((option) => {
          const active = age === option;
          return (
            <Pressable
              key={option}
              onPress={() => onAgeChange(option)}
              style={[styles.agePill, active && styles.agePillActive]}
            >
              <Text style={[styles.agePillLabel, active && styles.agePillLabelActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  avatarPreview: {
    alignItems: 'center',
    marginBottom: spacing.huge,
  },
  nameField: {
    marginBottom: spacing.xxl,
  },
  sectionLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.textFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: spacing.md,
  },
  ageRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  agePill: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  agePillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  agePillLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize['2xl'],
    color: colors.text,
  },
  agePillLabelActive: {
    color: colors.white,
  },
  error: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.error,
    marginTop: spacing.xxl,
  },
});
