import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LayoutControls } from './MediaControls';

interface VideoOverlayProps {
  onFullScreen: () => void;
  onDefaultScreen: () => void;
  onSplitScreen: () => void;
  currentMode?: 'default' | 'fullscreen' | 'splitscreen';
}

export default function VideoOverlay({
  onFullScreen,
  onDefaultScreen,
  onSplitScreen,
  currentMode = 'default',
}: VideoOverlayProps) {
  const [overlayIsVisible, setOverlayIsVisible] = useState<boolean>(false);
  const overlayTimer = useRef<NodeJS.Timeout | null>(null);
  const backgroundOpacity = useSharedValue(0);

  useEffect(() => {
    return () => {
      if (overlayTimer.current) {
        clearTimeout(overlayTimer.current);
        overlayTimer.current = null;
      }
    };
  }, []);

  const opacityAnimator = () => {
    if (overlayTimer.current) {
      clearTimeout(overlayTimer.current);
    }

    if (overlayIsVisible) {
      console.log('Animation already active. Please wait.');
      fadeOutOverlay();
      return;
    } else {
      setOverlayIsVisible(true);
      fadeInOverlay();
    }

    overlayTimer.current = setTimeout(fadeOutOverlay, 1500);
  };

  const fadeInOverlay = () => {
    backgroundOpacity.value = withTiming(0.3, { duration: 250 });
    console.log('Showing background with media controls');
  };

  const fadeOutOverlay = () => {
    backgroundOpacity.value = withTiming(0, { duration: 250 });
    setOverlayIsVisible(false);
    console.log('Hiding background and media controls');
  };

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  }, []);

  const resetOverlayTimer = () => {
    if (overlayTimer.current) {
      clearTimeout(overlayTimer.current);
    }
    overlayTimer.current = setTimeout(fadeOutOverlay, 1500);
  };

  const handleFullScreen = () => {
    console.log('Entering fullscreen mode');
    onFullScreen();
  };

  const handleDefaultScreen = () => {
    console.log('Exiting fullscreen mode');
    onDefaultScreen();
  };

  const handleSplitScreen = () => {
    console.log('Toggling split screen mode');
    onSplitScreen();
  };

  return (
    <View className="absolute flex flex-1" style={[StyleSheet.absoluteFillObject]}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: 'black' },
          backgroundAnimatedStyle,
        ]}
      />

      <Pressable
        className="flex-1"
        style={[StyleSheet.absoluteFillObject]}
        onPress={() => {
          opacityAnimator();
        }}
      />

      {overlayIsVisible && (
        <Animated.View
          pointerEvents="box-none"
          entering={FadeIn.duration(200).delay(50)}
          exiting={FadeOut.duration(250)}
          style={[StyleSheet.absoluteFillObject]}>
          <View style={[StyleSheet.absoluteFillObject]}>
            <LayoutControls
              onFullScreen={handleFullScreen}
              onDefaultScreen={handleDefaultScreen}
              onSplitScreen={handleSplitScreen}
              resetOverlayFadeoutTimer={resetOverlayTimer}
              currentMode={currentMode}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}
