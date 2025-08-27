import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import RecordButton from 'app/components/RecordButton';
import { DEVICE_TYPE, useIsPortrait } from '../hooks/DeviceProperties';
import { useEffect, useRef, useState, useMemo } from 'react';
import * as MediaLibrary from 'expo-media-library';
import {
  ensureFileExists,
  persistRecordingLocally,
  saveToGallery,
} from 'app/recording_service/LocalFileService';
import PauseButton from 'app/components/PauseButton';
import RecordingTimer from 'app/components/RecordingTimer';
import ReferenceVideo from 'app/components/ReferenceVideo';
import Svg, { Path } from 'react-native-svg';

export default function RecordingSessionScreen() {
  const DARK_BLUE = '#020617';
  const LIGHT_BLUE = '#334155';

  const DESIRED_ASPECT_RATIO = '16:9';
  const DESIRED_BITRATE = 20000;

  const MAX_VIDEO_DURATION_SECONDS = 15 * 60;

  const isPortrait = useIsPortrait();
  const aspectRatio = isPortrait ? 9 / 16 : 16 / 9;

  const [cameraPermission, setCameraPermission] = useState<boolean>(false);
  const [microphonePermission, setMicrophonePermission] = useState<boolean>(false);
  const [mediaPermission, setMediaPermission] = useState<boolean>(false);
  const isFocused = useIsFocused();

  /**
   * Reference to the camera preview which allows us to know if the preview has mounted properly.
   */
  const cameraRef = useRef<CameraView | null>(null);

  /**
   * Hooks to help manage recording lifecycles.
   */
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showPauseButton, setShowPauseButton] = useState<boolean>(false);

  /**
   * Hooks to help us manage and update URI and save directory for video output files.
   */
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [saveDir, setSaveDir] = useState<string | null>(null);

  /**
   * State to manage timer background color and reset
   */
  const [timerColor, setTimerColor] = useState<string>('bg-red-800');
  const [resetTimer, setResetTimer] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      resetRecordingStates();
    };
  }, []);

  useEffect(() => {
    if (videoUri) {
      console.log('New recording saved at:', videoUri);
    }
  }, [videoUri]);

  useEffect(() => {
    (async () => {
      if (!cameraPermission) {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(cameraPermission.granted);
        console.log(
          `
          Camera Status: ${cameraPermission.status}
          Camera Granted: ${cameraPermission.granted}
          Camera Permission can be asked again: ${cameraPermission.canAskAgain}
          `
        );
      }
      if (!microphonePermission) {
        const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
        setMicrophonePermission(microphonePermission.granted);
        console.log(
          `
          Microphone Status: ${microphonePermission.status}
          Microphone Granted: ${microphonePermission.granted}
          Microphone Permission can be asked again: ${microphonePermission.canAskAgain}
          `
        );
      }
      if (!mediaPermission) {
        const mediaPermission = await MediaLibrary.requestPermissionsAsync(true);
        setMediaPermission(mediaPermission.granted);
        const dir = await ensureFileExists();
        setSaveDir(dir);
        console.log(
          `
          MediaLibrary Status: ${mediaPermission.status}
          MediaLibrary Granted: ${mediaPermission.granted}
          MediaLibrary Permission can be asked again: ${mediaPermission.canAskAgain}
          `
        );
      }
    })();
  }, [cameraPermission, microphonePermission, mediaPermission]);

  const startRecording = async () => {
    if (!cameraPermission || !microphonePermission) {
      console.warn('Permissions not granted.');
      return;
    }
    if (!cameraRef.current || isRecording) return;
    setIsRecording(true);
    setShowPauseButton(true);
    setResetTimer(false);
    const videoOutput = await cameraRef.current.recordAsync({
      maxDuration: MAX_VIDEO_DURATION_SECONDS,
    });
    const sourceUri = (videoOutput as any)?.uri as string | undefined;
    if (!sourceUri) {
      console.warn('No video URI returned from recordAsync');
      return;
    }
    setVideoUri(sourceUri);

    if (saveDir) {
      const persisted = await persistRecordingLocally(sourceUri, saveDir);
      if (persisted.ok) {
        setVideoUri(persisted.destinationUri);
        console.log('Saved recording to', persisted.destinationUri);
        if (mediaPermission) {
          const gallery = await saveToGallery(persisted.destinationUri, 'RecordTheseHands');
          if (!gallery.ok) {
            console.error('Failed to save to gallery:', gallery.error);
          }
        }
      } else {
        console.error('Failed to save recording locally:', persisted.error);
      }
    }

    resetRecordingStates();
  };

  const stopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;
    try {
      cameraRef.current.stopRecording();
      setResetTimer(true);
      resetRecordingStates();
    } catch (error) {
      console.error('Stop recording failed:', error);
      resetRecordingStates();
    }
  };

  const togglePause = async () => {
    if (!cameraRef.current || !isRecording) return;
    try {
      await cameraRef.current.toggleRecordingAsync();
      const nextPauseState = !isPaused;

      if (nextPauseState) {
        setTimerColor('bg-slate-800');
      } else {
        setTimerColor('bg-red-800');
      }

      setIsPaused(nextPauseState);
    } catch (error: any) {
      console.error('Failed to pause recording:', error);
    }
  };

  const resetRecordingStates = () => {
    setIsRecording(false);
    setIsPaused(false);
    setShowPauseButton(false);
    setTimerColor('bg-red-800');
  };

  const cameraContainerStyle = StyleSheet.create({
    phonePortrait: {
      aspectRatio: aspectRatio,
      height: '100%',
      borderRadius: 16,
    },
    phoneLandscape: {
      aspectRatio: aspectRatio,
      width: '100%',
      bottom: 0,
      borderRadius: 16,
    },
    tabletPortrait: {
      aspectRatio: aspectRatio,
      height: '100%',
      bottom: 0,
      borderRadius: 32,
    },
    tabletLandscape: {
      aspectRatio: aspectRatio,
      width: '80%',
      borderRadius: 32,
      bottom: 0,
    },
  });

  const videoAspectRatio = 16 / 9;

  const videoContainerStyle = StyleSheet.create({
    phonePortrait: {
      aspectRatio: videoAspectRatio,
      width: '50%',
      borderRadius: 16,
    },
    phoneLandscape: {
      aspectRatio: videoAspectRatio,
      width: '30%',
      borderRadius: 16,
    },
    tabletPortrait: {
      aspectRatio: videoAspectRatio,
      width: '90%',
      borderRadius: 32,
    },
    tabletLandscape: {
      aspectRatio: videoAspectRatio,
      width: '20%',
      borderRadius: 32,
    },
    video: {
      borderRadius: 16,
      ...StyleSheet.absoluteFillObject,
    },
  });

  let cameraStyle = null;
  let videoStyle = null;
  let flexDirection = '';
  if (DEVICE_TYPE === 'Phone' && isPortrait) {
    cameraStyle = cameraContainerStyle.phonePortrait;
    videoStyle = videoContainerStyle.phonePortrait;
    flexDirection = 'flex-col';
  } else if (DEVICE_TYPE === 'Phone' && !isPortrait) {
    cameraStyle = cameraContainerStyle.phoneLandscape;
    videoStyle = videoContainerStyle.phoneLandscape;
    flexDirection = 'flex-row-reverse';
  } else if (DEVICE_TYPE === 'Tablet' && isPortrait) {
    cameraStyle = cameraContainerStyle.tabletPortrait;
    videoStyle = videoContainerStyle.tabletPortrait;
    flexDirection = 'flex-col';
  } else if (DEVICE_TYPE === 'Tablet' && !isPortrait) {
    cameraStyle = cameraContainerStyle.tabletLandscape;
    videoStyle = videoContainerStyle.tabletLandscape;
    flexDirection = 'flex-col';
  } else {
    console.log('Your device does not have a default supported style.');
    return;
  }

  if (!cameraStyle) {
    return null;
  }

  let parentContainerStyle = `flex h-full w-full items-center ${flexDirection}`;

  // CameraView is buggy with NativeWind. Use inline + sheet styling instead.
  return (
    <LinearGradient
      className="h-screen w-screen flex-col"
      colors={[DARK_BLUE, LIGHT_BLUE]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}>
      <SafeAreaView className="relative flex-1 items-center">
        <View className={parentContainerStyle}>
          <View className="z-10 m-2" style={videoStyle}>
            <ReferenceVideo />
          </View>

          <View className="m-2 w-full flex-1 flex-col items-center">
            {isRecording && (
              <RecordingTimer background={timerColor} paused={isPaused} reset={resetTimer} />
            )}
            {isFocused && (
              <CameraView
                ref={cameraRef}
                ratio={DESIRED_ASPECT_RATIO}
                videoBitrate={DESIRED_BITRATE}
                videoQuality="2160p"
                style={cameraStyle}
                facing="front"
                mode="video"
              />
            )}

            <View
              className="absolute bottom-0 flex flex-row items-center justify-center gap-4 rounded-2xl p-2"
              // style={{ backgroundColor: 'rgba(71, 85, 105, 0.4)' }}
            >
              <RecordButton
                isPortrait={isPortrait}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
              />
              {showPauseButton && <PauseButton onTogglePause={togglePause} />}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
