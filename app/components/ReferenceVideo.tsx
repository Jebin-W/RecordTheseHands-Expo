import { DEVICE_TYPE, useIsPortrait } from 'app/hooks/DeviceProperties';
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button } from 'react-native';

const prompt = require('../references/resource_reference_videos_bed.mp4');

export default function ReferenceVideo() {
  const player = useVideoPlayer(prompt, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View className="flex-1 justify-center rounded bg-transparent">
      <VideoView
        style={{ flex: 1, borderRadius: 16 }}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}
