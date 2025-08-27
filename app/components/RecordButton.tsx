import { Animated, Pressable, View } from 'react-native';
import { useRecordButton } from 'app/hooks/ButtonInteract';
import { useState } from 'react';

interface RecordButtonProps {
  isPortrait: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export default function RecordButton({
  isPortrait,
  onStartRecording,
  onStopRecording,
}: RecordButtonProps) {
  const [size, setSize] = useState(0);
  const { warpAnimation, scaleAnimation, handleToggleRecording } = useRecordButton({
    onStartRecording,
    onStopRecording,
  });

  return (
    <View
      style={{
        padding: 2,
        display: 'flex',
        aspectRatio: '1 / 1',
        height: '8%',
        maxHeight: 86,
        maxWidth: 86,
        minHeight: 54,
        minWidth: 54,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        borderWidth: 4,
        borderColor: '#ffffff',
      }}>
      <Pressable
        onLayout={(event) => setSize(event.nativeEvent.layout.width)}
        onPress={handleToggleRecording}
        className="flex h-full w-full border-spacing-4 items-center justify-center">
        <Animated.View
          style={{
            backgroundColor: '#dc2626',
            width: '80%',
            height: '80%',
            maxWidth: 60,
            maxHeight: 60,
            minWidth: 40,
            minHeight: 40,
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
