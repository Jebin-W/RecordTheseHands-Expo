import { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

export default function useRecordButton() {
  const [isRecording, setIsRecording] = useState(false);
  const warpAnimation = useRef(new Animated.Value(1)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const startRecording = () => {
    console.log('Start recording.');
    setIsRecording(true);
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(warpAnimation, {
        toValue: 0.4,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const stopRecording = () => {
    console.log('Stop recording.');
    setIsRecording(false);
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(warpAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const recordingButtonAnimationHandler = () => {
    console.log('Calling animation handler.');
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  useEffect(() => {
    return () => {
      setIsRecording(false);
    };
  }, []);

  return {
    warpAnimation,
    scaleAnimation,
    isRecording,
    recordingButtonAnimationHandler,
    startRecording,
    stopRecording,
  };
}
