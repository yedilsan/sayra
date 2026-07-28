import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetScrollViewMethods,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { forwardRef, useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { sendChatMessage } from '@/api/ai';
import { colors, fontFamily, fontSize, radii, shadows, spacing } from '@/theme';
import type { ChatMessage } from '@/types';

let messageIdCounter = 0;
function nextMessageId() {
  messageIdCounter += 1;
  return `msg-${messageIdCounter}`;
}

export const AiAssistantSheet = forwardRef<BottomSheetModal>((_props, ref) => {
  const { t } = useTranslation();
  const scrollRef = useRef<BottomSheetScrollViewMethods>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
    ),
    [],
  );

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) {
      return;
    }

    setInput('');
    setMessages((prev) => [...prev, { id: nextMessageId(), role: 'USER', content: text }]);
    setIsSending(true);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));

    try {
      const reply = await sendChatMessage(text);
      setMessages((prev) => [...prev, { id: nextMessageId(), role: 'ASSISTANT', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextMessageId(), role: 'ASSISTANT', content: t('common.somethingWentWrong') },
      ]);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }
  }

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['75%']}
      enablePanDownToClose
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.container}>
        <View style={styles.header}>
          <LinearGradient colors={colors.gradient} style={styles.avatar}>
            <Text style={styles.avatarText}>Ra</Text>
          </LinearGradient>
          <Text style={styles.greeting}>{t('ai.greeting')}</Text>
        </View>

        <BottomSheetScrollView
          ref={scrollRef}
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.introBubble}>
            <Text style={styles.introText}>{t('ai.intro')}</Text>
          </View>

          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.bubble,
                message.role === 'USER' ? styles.bubbleUser : styles.bubbleAssistant,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  message.role === 'USER' ? styles.bubbleTextUser : styles.bubbleTextAssistant,
                ]}
              >
                {message.content}
              </Text>
            </View>
          ))}

          {isSending ? <ActivityIndicator style={styles.typingIndicator} color={colors.textMuted} /> : null}
        </BottomSheetScrollView>

        <View style={styles.inputRow}>
          <BottomSheetTextInput
            value={input}
            onChangeText={setInput}
            placeholder={t('ai.placeholder')}
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            multiline
          />
          <Pressable
            onPress={handleSend}
            disabled={!input.trim() || isSending}
            style={[styles.sendButton, (!input.trim() || isSending) && styles.sendButtonDisabled]}
          >
            <Text style={styles.sendButtonText}>{'→'}</Text>
          </Pressable>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AiAssistantSheet.displayName = 'AiAssistantSheet';

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.lg,
    color: colors.white,
  },
  greeting: {
    fontFamily: fontFamily.black,
    fontSize: fontSize['5xl'],
    color: colors.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  introBubble: {
    backgroundColor: colors.chipInactiveBg,
    borderRadius: radii.xxl,
    padding: spacing.xxl,
  },
  introText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.textMuted,
    lineHeight: 20,
  },
  bubble: {
    maxWidth: '85%',
    borderRadius: radii.xxl,
    padding: spacing.xl,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.tint.teal.bg,
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    backgroundColor: colors.chipInactiveBg,
  },
  bubbleText: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: colors.tint.teal.text,
  },
  bubbleTextAssistant: {
    color: colors.text,
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.lg,
    color: colors.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: radii.circle,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize['3xl'],
    color: colors.white,
  },
});
