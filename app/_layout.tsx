import { Stack } from 'expo-router';
import '../global.css';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  DEVICE_NAME,
  DEVICE_BRAND,
  DEVICE_TYPE,
  DEVICE_OS,
  DEVICE_OS_VER,
  useIsPortrait,
} from './hooks/DeviceProperties';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  console.log(
    `
    Model: ${DEVICE_NAME}
    Brand: ${DEVICE_BRAND}
    Device Type: ${DEVICE_TYPE}
    OS: ${DEVICE_OS}
    OS Version: ${DEVICE_OS_VER}
    `
  );

  return (
    <>
      <StatusBar style="dark"></StatusBar>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="h-screen flex-1">
          <SafeAreaProvider className="flex-1">
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaProvider>
        </View>
      </GestureHandlerRootView>
    </>
  );
}
