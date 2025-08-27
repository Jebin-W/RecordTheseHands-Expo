import { Animated, Pressable, View } from 'react-native';
import { usePauseButton } from 'app/hooks/ButtonInteract';
import { useState } from 'react';

interface PauseButtonProps {
  onTogglePause: () => void;
}

export default function PauseButton({ onTogglePause }: PauseButtonProps) {
  const [size, setSize] = useState(0);
  const { warpAnimation, scaleAnimation, handleTogglePause } = usePauseButton({
    onTogglePause,
  });

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 32,
        right: 24,
        display: 'flex',
        aspectRatio: '1 / 1',
        height: 44,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        borderWidth: 2,
        borderColor: '#ffffff',
      }}>
      <Pressable
        onLayout={(event) => setSize(event.nativeEvent.layout.width)}
        onPress={handleTogglePause}
        className="flex h-full w-full border-spacing-4 items-center justify-center">
        <Animated.View
          style={{
            backgroundColor: '#f59e0b',
            width: '70%',
            height: '70%',
            transform: [{ scale: scaleAnimation }],
            borderRadius: warpAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [4, size / 2],
            }),
          }}
        />
      </Pressable>
    </View>
  );
}
