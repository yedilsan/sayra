import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AacCategoryChip } from '@/components/AacCategoryChip';
import { AAC_TILE_ROW_HEIGHT, AacTile } from '@/components/AacTile';
import { useAacCategories, useAacCategoryCards, useAacCoreCards } from '@/hooks/useAac';
import { useSpeak } from '@/hooks/useSpeak';
import { useAuthStore } from '@/store/auth-store';
import { colors, fontFamily, fontSize, radii, spacing } from '@/theme';
import type { AacCard } from '@/types';
import { pickLocalized } from '@/utils/localized';

interface StripWord {
  key: string;
  label: string;
}

const MAX_ROWS = 4;
const MIN_ROWS = 1;
const ROW_GAP = spacing.sm;
const CAROUSEL_PADDING_Y = spacing.lg;

function chunkIntoColumns<T>(items: T[], rows: number): T[][] {
  const columns: T[][] = [];
  for (let i = 0; i < items.length; i += rows) {
    columns.push(items.slice(i, i + rows));
  }
  return columns;
}

/**
 * The carousel is a horizontal strip of fixed-height rows, so on short screens four rows
 * would overflow and push the category row off-screen. Fit as many rows as the measured
 * space allows instead — fewer rows just means more columns to scroll through, and every
 * tile stays reachable.
 */
function rowsThatFit(measuredHeight: number): number {
  // onLayout reports the zone's border box, so drop its own padding first — counting
  // that as usable space is what lets an extra row in and clips the labels off it.
  const usable = measuredHeight - CAROUSEL_PADDING_Y * 2;
  const rows = Math.floor((usable + ROW_GAP) / (AAC_TILE_ROW_HEIGHT + ROW_GAP));
  return Math.max(MIN_ROWS, Math.min(MAX_ROWS, rows));
}

export default function AacScreen() {
  const { t } = useTranslation();
  const lang = useAuthStore((state) => state.user?.language ?? 'EN');
  const { speak, isSpeaking } = useSpeak();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [strip, setStrip] = useState<StripWord[]>([]);
  const [carouselHeight, setCarouselHeight] = useState<number | null>(null);

  const categoriesQuery = useAacCategories();
  const coreCardsQuery = useAacCoreCards();
  const categoryCardsQuery = useAacCategoryCards(selectedCategoryId);

  const tiles: AacCard[] = selectedCategoryId ? categoryCardsQuery.data ?? [] : coreCardsQuery.data ?? [];
  const isLoadingTiles = selectedCategoryId ? categoryCardsQuery.isPending : coreCardsQuery.isPending;
  const rows = carouselHeight === null ? MAX_ROWS : rowsThatFit(carouselHeight);
  const columns = useMemo(() => chunkIntoColumns(tiles, rows), [tiles, rows]);

  function handleCarouselLayout(event: LayoutChangeEvent) {
    setCarouselHeight(event.nativeEvent.layout.height);
  }

  function handleSelectCategory(categoryId: string) {
    setSelectedCategoryId((current) => (current === categoryId ? null : categoryId));
  }

  function handleTapTile(card: AacCard) {
    const label = pickLocalized(card, 'text', lang);
    setStrip((prev) => [...prev, { key: `${card.id}-${prev.length}`, label }]);
  }

  function handleSpeak() {
    if (strip.length === 0) {
      return;
    }
    const text = strip.map((word) => word.label).join(' ');
    setStrip([]);
    void speak(text);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('aac.title')}</Text>
        <Text style={styles.subtitle}>{t('aac.subtitle')}</Text>

        <View style={styles.stripRow}>
          <View style={styles.stripBox}>
            {strip.length === 0 ? (
              <Text style={styles.stripPlaceholder}>{t('aac.placeholder')}</Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stripPills}>
                {strip.map((word) => (
                  <View key={word.key} style={styles.stripPill}>
                    <Text style={styles.stripPillText}>{word.label}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <Pressable
            onPress={handleSpeak}
            disabled={strip.length === 0 || isSpeaking}
            accessibilityLabel={t('aac.speakLabel')}
            style={[styles.speakButton, strip.length > 0 && !isSpeaking && styles.speakButtonActive]}
          >
            {isSpeaking ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <View style={styles.playGlyph} />
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.carouselZone} onLayout={handleCarouselLayout}>
        {isLoadingTiles || carouselHeight === null ? (
          <ActivityIndicator color={colors.textMuted} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
          >
            {columns.map((column, columnIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <View key={columnIndex} style={styles.column}>
                {column.map((card) => (
                  <AacTile
                    key={card.id}
                    id={card.id}
                    label={pickLocalized(card, 'text', lang)}
                    imageUrl={card.imageUrl}
                    onPress={() => handleTapTile(card)}
                  />
                ))}
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.categoryZone}>
        {categoriesQuery.isPending ? (
          <ActivityIndicator color={colors.textMuted} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {(categoriesQuery.data ?? []).map((category) => (
              <AacCategoryChip
                key={category.id}
                id={category.id}
                label={pickLocalized(category, 'name', lang)}
                imageUrl={category.imageUrl}
                active={selectedCategoryId === category.id}
                onPress={() => handleSelectCategory(category.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.screenX,
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
  stripRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  stripBox: {
    flex: 1,
    minHeight: 48,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  stripPlaceholder: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.placeholder,
  },
  stripPills: {
    gap: spacing.sm,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  stripPill: {
    backgroundColor: colors.tint.teal.bg,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  stripPillText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.tint.teal.text,
  },
  speakButton: {
    width: 48,
    height: 48,
    borderRadius: radii.lg,
    backgroundColor: colors.disabled,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakButtonActive: {
    backgroundColor: colors.tabs.aac,
  },
  playGlyph: {
    width: 0,
    height: 0,
    borderTopWidth: 9,
    borderBottomWidth: 9,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: colors.white,
    marginLeft: 4,
  },
  carouselZone: {
    // flexShrink + minHeight:0 let this absorb whatever space is left over instead of
    // pushing the category row past the bottom of the screen.
    flex: 1,
    minHeight: 0,
    justifyContent: 'center',
    paddingVertical: CAROUSEL_PADDING_Y,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  carousel: {
    gap: ROW_GAP,
    paddingHorizontal: spacing.screenX,
  },
  column: {
    gap: ROW_GAP,
  },
  categoryZone: {
    paddingVertical: spacing.xl,
  },
  categoryRow: {
    paddingHorizontal: spacing.screenX,
    gap: spacing.sm,
  },
});
