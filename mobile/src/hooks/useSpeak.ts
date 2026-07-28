import { useCallback, useRef, useState } from 'react';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { File, Paths } from 'expo-file-system';

import { synthesizeSpeech } from '@/api/aac';

export function useSpeak() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const speak = useCallback(async (text: string) => {
    if (!text.trim() || isSpeaking) {
      return;
    }

    setIsSpeaking(true);
    let file: File | null = null;

    try {
      const bytes = await synthesizeSpeech(text);
      await setAudioModeAsync({ playsInSilentMode: true });

      file = new File(Paths.cache, `tts-${Date.now()}.mp3`);
      file.write(new Uint8Array(bytes));

      const player = createAudioPlayer(file.uri);
      const capturedFile = file;

      const finish = () => {
        subscription.remove();
        player.remove();
        try {
          capturedFile.delete();
        } catch {
          // best-effort cleanup
        }
        setIsSpeaking(false);
        cleanupRef.current = null;
      };

      const subscription = player.addListener('playbackStatusUpdate', (status) => {
        if (status.didJustFinish) {
          finish();
        }
      });

      cleanupRef.current = finish;
      player.play();
    } catch {
      setIsSpeaking(false);
      cleanupRef.current = null;
    }
  }, [isSpeaking]);

  return { speak, isSpeaking };
}
