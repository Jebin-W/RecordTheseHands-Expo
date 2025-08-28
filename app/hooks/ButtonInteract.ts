import { useCallback, useEffect, useState } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

export function useRecordButton(recordingStates?: {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [buttonSize, setButtonSize] = useState<number>(0);
  const buttonAnimationProgress = useSharedValue(0);

  useEffect(() => {
    return () => {
      setIsRecording(false);
    };
  }, []);

  const startRecordingAnimation = useCallback(() => {
    buttonAnimationProgress.value = withTiming(1, { duration: 100 });
  }, [buttonAnimationProgress]);

  const stopRecordingAnimation = useCallback(() => {
    buttonAnimationProgress.value = withTiming(0, { duration: 100 });
  }, [buttonAnimationProgress]);

  const buttonAnimationStyle = useAnimatedStyle(() => {
    const scale = interpolate(buttonAnimationProgress.value, [0, 1], [1, 0.8]);
    const warp = interpolate(buttonAnimationProgress.value, [0, 1], [1, 0.4]);
    const borderRadius = warp * (buttonSize / 2);

    return {
      transform: [{ scale }],
      borderRadius: borderRadius,
    };
  }, [buttonSize]);

  useEffect(() => {
    if (isRecording) {
      console.log('Starting recording');
      startRecordingAnimation();
    } else {
      console.log('Stopping recording.');
      stopRecordingAnimation();
    }
  }, [isRecording, startRecordingAnimation, stopRecordingAnimation]);

  const handleToggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      if (recordingStates?.onStartRecording) {
        try {
          recordingStates.onStartRecording();
        } catch (error) {
          console.error('Failed to start recording:', error);
        }
      }
    } else {
      setIsRecording(false);
      if (recordingStates?.onStopRecording) {
        try {
          recordingStates.onStopRecording();
        } catch (error: any) {
          console.error('Failed to stop recording:', error);
        }
      }
    }
  };

  return {
    buttonAnimationProgress,
    buttonAnimationStyle,
    isRecording,
    handleToggleRecording,
    setButtonSize,
  };
}

export function usePauseButton(pauseState?: { onTogglePause: () => void }) {
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
    if (pauseState?.onTogglePause) {
      try {
        pauseState.onTogglePause();
      } catch (e) {
        console.error('Failed to resume recording:', e);
      }
    }
  };

  return { isPaused, handleTogglePause };
}
