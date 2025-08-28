import { useVideoPlayer, VideoView } from 'expo-video';
import { View } from 'react-native';
import VideoOverlay from './ReferenceVideoOverlay';

const prompt = require('../references/resource_reference_videos_bed.mp4');

interface ReferenceVideoProps {
  onFullScreen: () => void;
  onDefaultScreen: () => void;
  onSplitScreen: () => void;
  currentMode?: 'default' | 'fullscreen' | 'splitscreen';
}

export default function ReferenceVideo({
  onFullScreen,
  onDefaultScreen,
  onSplitScreen,
  currentMode = 'default',
}: ReferenceVideoProps) {
  const player = useVideoPlayer(prompt, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return (
    <View
      className="flex-1 justify-center overflow-hidden rounded bg-transparent"
      // style={{ overflow: 'hidden' }}
    >
      <VideoView
        style={{ flex: 1, borderRadius: 16 }}
        player={player}
        nativeControls={false}
        allowsFullscreen
        allowsPictureInPicture
      />

      <VideoOverlay
        onFullScreen={onFullScreen}
        onDefaultScreen={onDefaultScreen}
        onSplitScreen={onSplitScreen}
        currentMode={currentMode}
      />
    </View>
  );
}
