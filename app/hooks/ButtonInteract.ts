import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export function useRecordButton(recordingStates?: {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}) {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const warpAnimation = useRef(new Animated.Value(1)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      setIsRecording(false);
    };
  }, []);

  const startRecordingAnimation = useCallback(() => {
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(warpAnimation, {
        toValue: 0.4,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnimation, warpAnimation]);

  const stopRecordingAnimation = useCallback(() => {
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(warpAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnimation, warpAnimation]);

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
    warpAnimation,
    scaleAnimation,
    isRecording: isRecording,
    handleToggleRecording,
  };
}

export function usePauseButton(pauseState?: { onTogglePause: () => void }) {
  const [isPaused, setIsPaused] = useState<boolean>(false);
  // const warpAnimation = useRef(new Animated.Value(1)).current;
  // const scaleAnimation = useRef(new Animated.Value(1)).current;
  // const glowAnimation = useRef(new Animated.Value(1)).current;

  // const startPauseAnimation = useCallback(() => {
  //   Animated.parallel([
  //     Animated.timing(scaleAnimation, {
  //       toValue: 0.8,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(warpAnimation, {
  //       toValue: 0.4,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }),
  //   ]).start();
  // }, [scaleAnimation, warpAnimation]);

  // const stopPauseAnimation = useCallback(() => {
  //   Animated.parallel([
  //     Animated.timing(scaleAnimation, {
  //       toValue: 1,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(warpAnimation, {
  //       toValue: 1,
  //       duration: 200,
  //       useNativeDriver: true,
  //     }),
  //   ]).start();
  // }, [scaleAnimation, warpAnimation]);

  // useEffect(() => {
  //   if (isPaused) {
  //     startPauseAnimation();
  //   } else {
  //     stopPauseAnimation();
  //   }
  // }, [isPaused, startPauseAnimation, stopPauseAnimation]);

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
