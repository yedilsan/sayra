import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AvatarCircle } from '@/components/AvatarCircle';
import { useChildren } from '@/hooks/useChildren';
import { useChildStore } from '@/store/child-store';
import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/theme';

export const ChildSwitchSheet = forwardRef<BottomSheetModal>((_props, ref) => {
  const { t } = useTranslation();
  const localRef = useRef<BottomSheetModal>(null);
  useImperativeHandle(ref, () => localRef.current as BottomSheetModal, []);

  const childrenQuery = useChildren();
  const activeChildId = useChildStore((state) => state.activeChildId);
  const setActiveChildId = useChildStore((state) => state.setActiveChildId);

  const children = childrenQuery.data ?? [];

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ),
    [],
  );

  function handleSelect(childId: string) {
    setActiveChildId(childId);
    localRef.current?.dismiss();
  }

  function handleAddAnother() {
    localRef.current?.dismiss();
    router.push('/children/new');
  }

  return (
    <BottomSheetModal
      ref={localRef}
      snapPoints={['50%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.container}>
        <Text style={styles.title}>{t('childSwitch.title')}</Text>

        <View style={styles.list}>
          {children.map((child) => {
            const active = child.id === activeChildId;
            return (
              <Pressable key={child.id} onPress={() => handleSelect(child.id)} style={styles.card}>
                <AvatarCircle id={child.id} name={child.name} photoUrl={child.avatarUrl} size={44} />
                <View style={styles.cardText}>
                  <Text style={styles.cardName}>{child.name}</Text>
                  <Text style={styles.cardMeta}>{t('onboarding.ageLabel', { age: child.age })}</Text>
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

        <Pressable onPress={handleAddAnother} style={styles.addButton}>
          <Text style={styles.addButtonLabel}>{t('onboarding.addAnotherChild')}</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ChildSwitchSheet.displayName = 'ChildSwitchSheet';

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: colors.card,
    borderRadius: radii.sheet,
  },
  handleIndicator: {
    backgroundColor: colors.border,
    width: 40,
    height: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  title: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['6xl'],
    color: colors.text,
    marginBottom: spacing.xxl,
  },
  list: {
    gap: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardAlt,
    borderRadius: radii.xxl,
    padding: spacing.xl,
    gap: spacing.xl,
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
  addButton: {
    marginTop: spacing.xxl,
    height: 52,
    borderRadius: radii.xxl,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  addButtonLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textMuted,
  },
});
