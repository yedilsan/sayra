import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import { Tabs, usePathname } from 'expo-router';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FloatingAiButton } from '@/components/FloatingAiButton';
import { IconPlaceholder } from '@/components/IconPlaceholder';
import { AiAssistantSheet } from '@/components/sheets/AiAssistantSheet';
import { ChildSwitchSheet } from '@/components/sheets/ChildSwitchSheet';
import { TopChildBar } from '@/components/TopChildBar';
import { useChildren } from '@/hooks/useChildren';
import { useChildStore } from '@/store/child-store';
import { colors, fontFamily } from '@/theme';

/** Icon + label row; the device's bottom inset is added on top of this. */
const TAB_BAR_CONTENT_HEIGHT = 56;

export default function TabsLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const childSwitchRef = useRef<BottomSheetModal>(null);
  const aiSheetRef = useRef<BottomSheetModal>(null);

  const childrenQuery = useChildren();
  const activeChildId = useChildStore((state) => state.activeChildId);
  const activeChild = childrenQuery.data?.find((child) => child.id === activeChildId);

  const topBarHeight = insets.top + 56;
  // Grow the bar by the home-indicator / gesture-nav inset so tabs are never underneath it.
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;
  const showAiButton = !pathname.startsWith('/aac');

  const sceneStyle = useMemo(
    () => ({ paddingTop: topBarHeight, paddingBottom: tabBarHeight, backgroundColor: colors.background }),
    [topBarHeight, tabBarHeight],
  );

  const tabBarStyle = useMemo(
    () => [styles.tabBar, { height: tabBarHeight, paddingBottom: insets.bottom }],
    [tabBarHeight, insets.bottom],
  );

  return (
    <View style={styles.flex}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarInactiveTintColor: colors.disabled,
          tabBarStyle,
          tabBarLabelStyle: styles.tabBarLabel,
          sceneStyle,
          tabBarBackground: () => (
            <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFill} />
          ),
        }}
      >
        <Tabs.Screen
          name="aac/index"
          options={{
            title: t('tabs.aac'),
            tabBarActiveTintColor: colors.tabs.aac,
            tabBarIcon: ({ color, focused }) => (
              <IconPlaceholder size={24} color={focused ? color : colors.disabled} shape="circle" />
            ),
          }}
        />
        <Tabs.Screen
          name="exercises"
          options={{
            title: t('tabs.exercises'),
            tabBarActiveTintColor: colors.tabs.exercises,
            tabBarIcon: ({ color, focused }) => (
              <IconPlaceholder size={24} color={focused ? color : colors.disabled} shape="square" />
            ),
          }}
        />
        <Tabs.Screen
          name="pronunciation"
          options={{
            title: t('tabs.pronunciation'),
            tabBarActiveTintColor: colors.tabs.pronunciation,
            tabBarIcon: ({ color, focused }) => (
              <IconPlaceholder size={24} color={focused ? color : colors.disabled} shape="circle" />
            ),
          }}
        />
        <Tabs.Screen
          name="therapists/index"
          options={{
            title: t('tabs.therapists'),
            tabBarActiveTintColor: colors.tabs.therapists,
            tabBarIcon: ({ color, focused }) => (
              <IconPlaceholder size={24} color={focused ? color : colors.disabled} shape="square" />
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: t('tabs.profile'),
            tabBarActiveTintColor: colors.tabs.profile,
            tabBarIcon: ({ color, focused }) => (
              <IconPlaceholder size={24} color={focused ? color : colors.disabled} shape="circle" />
            ),
          }}
        />
      </Tabs>

      <TopChildBar activeChild={activeChild} onPress={() => childSwitchRef.current?.present()} />

      {showAiButton ? (
        <FloatingAiButton
          bottom={tabBarHeight + 12}
          onPress={() => aiSheetRef.current?.present()}
        />
      ) : null}

      <ChildSwitchSheet ref={childSwitchRef} />
      <AiAssistantSheet ref={aiSheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    backgroundColor: Platform.select({ ios: 'transparent', default: 'rgba(251,248,242,0.96)' }),
    borderTopColor: colors.borderLight,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
  },
  tabBarLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: 11,
  },
});
