import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, Camera } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import RecordButton from 'app/components/RecordButton';
import { useIsPortrait } from '../hooks/DeviceProperties';
import { useLayoutManager } from '../hooks/LayoutManager';
import { useEffect, useRef, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import {
  ensureFileExists,
  persistRecordingLocally,
  saveToGallery,
} from 'app/recording_service/LocalFileService';
import PauseButton from 'app/components/PauseButton';
import RecordingTimer from 'app/components/RecordingTimer';
import ReferenceVideo from 'app/components/ReferenceVideo';
import Animated, { LinearTransition } from 'react-native-reanimated';
import PromptCard from 'app/components/Prompt';

export default function RecordingSessionScreen() {
  const DARK_BLUE = '#020617';
  const LIGHT_BLUE = '#334155';

  const DESIRED_ASPECT_RATIO = '16:9';
  const DESIRED_BITRATE = 20000;

  const MAX_VIDEO_DURATION_SECONDS = 15 * 60;

  const isPortrait = useIsPortrait();

  const { layoutState, switchToFullscreen, switchToSplitscreen, switchToDefault } =
    useLayoutManager();

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
      codec: 'jpeg',
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

  const { cameraStyle, videoStyle, flexDirection } = layoutState;

  if (!cameraStyle) {
    return null;
  }

  let parentContainerStyle = `flex-1 h-full w-full items-center justify-center ${flexDirection}`;

  const promptText = 'Bed   बिस्तर   ベッド   침대';

  // CameraView is buggy with NativeWind. Use inline + sheet styling instead.
  return (
    <LinearGradient
      className="h-screen w-screen flex-col"
      colors={[DARK_BLUE, LIGHT_BLUE]}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}>
      <SafeAreaView className="relative flex-1 items-center">
        <ScrollView
          horizontal
          bounces
          alwaysBounceHorizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 2,
          }}
          className="mx-4 my-2 flex w-97/100 rounded-xl bg-slate-900 p-2"
          style={{
            flexShrink: 0,
            minHeight: 28,
            maxHeight: 32,
            outlineWidth: 1,
            outlineColor: 'black',
          }}>
          <PromptCard prompt={promptText} />
        </ScrollView>
        <View className={parentContainerStyle}>
          {videoStyle && (
            <Animated.View className="m-2 " style={videoStyle} layout={LinearTransition}>
              <ReferenceVideo
                onFullScreen={switchToFullscreen}
                onDefaultScreen={switchToDefault}
                onSplitScreen={switchToSplitscreen}
                currentMode={layoutState.mode}
              />
            </Animated.View>
          )}

          {layoutState.mode !== 'fullscreen' && (
            <Animated.View
              className="m-2 w-full flex-1 flex-col items-center"
              layout={LinearTransition}>
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
                  mute={true}
                  videoStabilizationMode="auto"
                  facing="front"
                  mode="video"
                />
              )}

              <Animated.View
                className="absolute bottom-0 flex flex-row items-center justify-center gap-4 rounded-2xl p-2"
                // style={{ backgroundColor: 'rgba(71, 85, 105, 0.4)' }}
                layout={LinearTransition}>
                <RecordButton
                  isPortrait={isPortrait}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                />

                {showPauseButton && <PauseButton onTogglePause={togglePause} />}
              </Animated.View>
            </Animated.View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
