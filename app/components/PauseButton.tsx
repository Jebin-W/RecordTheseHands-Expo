import { Pressable, View } from 'react-native';
import { usePauseButton } from 'app/hooks/ButtonInteract';
import Svg, { Path } from 'react-native-svg';

interface PauseButtonProps {
  onTogglePause: () => void;
}

export default function PauseButton({ onTogglePause }: PauseButtonProps) {
  const { handleTogglePause, isPaused } = usePauseButton({
    onTogglePause,
  });

  return (
    <View
      style={{
        padding: 2,
        display: 'flex',
        height: 44,
        width: 44,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Pressable
        onPress={handleTogglePause}
        className="flex h-full w-full border-spacing-4 items-center justify-center">
        {isPaused ? (
          <Svg viewBox="0 0 24 24" fill="currentColor" className="h-7/10 w-7/10">
            <Path
              fill-rule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clip-rule="evenodd"
            />
          </Svg>
        ) : (
          <Svg viewBox="0 0 24 24" fill="currentColor" className="h-7/10 w-7/10">
            <Path
              fill-rule="evenodd"
              d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
              clip-rule="evenodd"
            />
          </Svg>
        )}
      </Pressable>
    </View>
  );
}
