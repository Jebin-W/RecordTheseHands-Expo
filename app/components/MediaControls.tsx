import { View, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface LayoutControlsProps {
  onFullScreen: () => void;
  onDefaultScreen: () => void;
  onSplitScreen: () => void;
  resetOverlayFadeoutTimer?: () => void;
  currentMode?: 'default' | 'fullscreen' | 'splitscreen';
}

export function LayoutControls({
  onFullScreen,
  onDefaultScreen,
  onSplitScreen,
  resetOverlayFadeoutTimer,
  currentMode = 'default',
}: LayoutControlsProps) {
  const isFullscreen = currentMode === 'fullscreen';

  const handleSplitScreen = () => {
    onSplitScreen();
    resetOverlayFadeoutTimer?.();
  };

  const handleFullScreen = () => {
    onFullScreen();
    resetOverlayFadeoutTimer?.();
  };

  const handleDefaultScreen = () => {
    onDefaultScreen();
    resetOverlayFadeoutTimer?.();
  };

  return (
    <View className="flex flex-1 flex-row items-end justify-end p-2">
      <SplitScreenButton onPress={handleSplitScreen} />
      {isFullscreen ? (
        <DefaultScreenButton onPress={handleDefaultScreen} />
      ) : (
        <FullScreenButton onPress={handleFullScreen} />
      )}
    </View>
  );
}

interface ButtonProps {
  onPress: () => void;
}

export function SplitScreenButton({ onPress }: ButtonProps) {
  return (
    <Pressable
      className="flex h-3/10 w-3/10 items-center justify-center rounded p-1"
      style={{ maxHeight: 40, maxWidth: 40 }}
      onPress={onPress}>
      <Svg className="flex-1" viewBox="0 0 24 24">
        <Path
          fill="currentColor"
          d="M12.5 2.75a.75.75 0 0 0-1.5 0v18.5a.75.75 0 0 0 1.5 0V2.75ZM2 6.25A2.25 2.25 0 0 1 4.25 4H10v16H4.25A2.25 2.25 0 0 1 2 17.75V6.25ZM19.25 20H13.5V4h5.75a2.25 2.25 0 0 1 2.25 2.25v11.5A2.25 2.25 0 0 1 19.25 20Z"
        />
      </Svg>
    </Pressable>
  );
}

export function FullScreenButton({ onPress }: ButtonProps) {
  return (
    <Pressable
      className="flex h-3/10 w-3/10 items-center justify-center rounded p-1"
      style={{ maxHeight: 40, maxWidth: 40 }}
      onPress={onPress}>
      <Svg className="flex-1" viewBox="0 0 20 20">
        <Path
          fill="currentColor"
          d="M3 5a2 2 0 0 1 2-2h2a.5.5 0 0 1 0 1H5a1 1 0 0 0-1 1v2a.5.5 0 0 1-1 0V5Zm9.5-1.5A.5.5 0 0 1 13 3h2a2 2 0 0 1 2 2v2a.5.5 0 0 1-1 0V5a1 1 0 0 0-1-1h-2a.5.5 0 0 1-.5-.5Zm-9 9a.5.5 0 0 1 .5.5v2a1 1 0 0 0 1 1h2a.5.5 0 0 1 0 1H5a2 2 0 0 1-2-2v-2a.5.5 0 0 1 .5-.5Zm13 0a.5.5 0 0 1 .5.5v2a2 2 0 0 1-2 2h-2a.5.5 0 0 1 0-1h2a1 1 0 0 0 1-1v-2a.5.5 0 0 1 .5-.5Z"
        />
      </Svg>
    </Pressable>
  );
}

export function DefaultScreenButton({ onPress }: ButtonProps) {
  return (
    <Pressable
      className="flex h-3/10 w-3/10 items-center justify-center rounded p-1"
      style={{ maxHeight: 40, maxWidth: 40 }}
      onPress={onPress}>
      <Svg className="flex-1" viewBox="0 0 20 20">
        <Path
          fill="currentColor"
          d="M14 5a1 1 0 0 0 1 1h2a.5.5 0 0 1 0 1h-2a2 2 0 0 1-2-2V3a.5.5 0 0 1 1 0v2ZM6 15a1 1 0 0 0-1-1H3a.5.5 0 0 1 0-1h2a2 2 0 0 1 2 2v2a.5.5 0 0 1-1 0v-2Zm8 0a1 1 0 0 1 1-1h2a.5.5 0 0 0 0-1h-2a2 2 0 0 0-2 2v2a.5.5 0 0 0 1 0v-2ZM5 6a1 1 0 0 0 1-1V3a.5.5 0 0 1 1 0v2a2 2 0 0 1-2 2H3a.5.5 0 0 1 0-1h2Z"
        />
      </Svg>
    </Pressable>
  );
}
