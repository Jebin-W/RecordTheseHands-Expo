import { Animated, Pressable, View } from 'react-native';
import useAutoHideTabBar from 'app/hooks/AutoHideTabBar';
import useRecordButton from 'app/hooks/RecordButtonInteract';
import { useState } from 'react';

interface RecordButtonProps {
  isPortrait: boolean;
}

export default function RecordButton({ isPortrait }: RecordButtonProps) {
  const { slideAnimation } = useAutoHideTabBar();
  const [size, setSize] = useState(0);
  const {
    warpAnimation,
    scaleAnimation,
    isRecording,
    recordingButtonAnimationHandler,
    startRecording,
    stopRecording,
  } = useRecordButton();

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 32,
        display: 'flex',
        aspectRatio: '1 / 1',
        height: '8%',
        maxHeight: 72,
        maxWidth: 72,
        minHeight: 60,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        borderWidth: 4,
        borderColor: '#ffffff',
      }}>
      <Pressable
        onLayout={(event) => setSize(event.nativeEvent.layout.width)}
        onPress={recordingButtonAnimationHandler}
        className="flex h-full w-full border-spacing-4 items-center justify-center">
        <Animated.View
          style={{
            backgroundColor: '#dc2626',
            width: '80%',
            height: '80%',
            maxWidth: 56,
            maxHeight: 56,
            minWidth: 44,
            minHeight: 44,
            transform: [{ scale: scaleAnimation }],
            borderRadius: warpAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, size / 2],
            }),
          }}></Animated.View>
      </Pressable>
    </View>
  );
}
