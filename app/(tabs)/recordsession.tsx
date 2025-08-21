import { View, Text, useWindowDimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import RecordButton from 'app/components/RecordButton';
import { DEVICE_TYPE, useIsPortrait } from '../hooks/DeviceProperties';

export default function RecordingSessionScreen() {
  const { width, height } = useWindowDimensions();
  const isPortrait = useIsPortrait();
  const aspectRatio = isPortrait ? 9 / 16 : 16 / 9;

  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  // console.log('Permission state:', permission);
  // console.log('Permission granted:', permission?.granted);
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center bg-white p-4">
          <Text className="mb-4 text-center text-lg">
            We need access to your camera to continue
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="rounded-lg bg-blue-500 px-6 py-3">
            <Text className="font-semibold text-white">Grant Camera Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const cameraStyle = StyleSheet.create({
    phonePortrait: {
      position: 'absolute',
      aspectRatio: aspectRatio,
      height: '90%',
      marginTop: 0,
      marginBottom: 8,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
    phoneLandscape: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      aspectRatio: aspectRatio,
      height: '100%',
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
    },
    tabletPortrait: {
      position: 'absolute',
      aspectRatio: aspectRatio,
      height: '90%',
      marginTop: 0,
      marginBottom: 8,
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
    tabletLandscape: {
      position: 'absolute',
      aspectRatio: aspectRatio,
      width: '50%',
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
    },
  });
  let style = null;
  if (DEVICE_TYPE === 'Phone' && isPortrait) {
    style = cameraStyle.phonePortrait;
  } else if (DEVICE_TYPE === 'Phone' && !isPortrait) {
    style = cameraStyle.phoneLandscape;
  } else if (DEVICE_TYPE === 'Tablet' && isPortrait) {
    style = cameraStyle.tabletPortrait;
  } else if (DEVICE_TYPE === 'Tablet' && !isPortrait) {
    style = cameraStyle.tabletLandscape;
  } else {
    console.log('Your device does not have a default supported style.');
    return;
  }

  // CameraView is buggy with NativeWind. Use inline styling instead.
  return (
    <LinearGradient
      className="h-screen w-screen flex-col"
      colors={['#020617', '#334155']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}>
      <SafeAreaView className="relative flex-1 items-center">
        {isFocused && (
          <CameraView
            ratio="16:9"
            videoBitrate={20000}
            videoQuality="2160p"
            style={style}
            facing="front"
          />
        )}
        <RecordButton isPortrait={isPortrait} />
      </SafeAreaView>
    </LinearGradient>
  );
}
