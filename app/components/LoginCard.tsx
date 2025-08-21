import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  GestureResponderEvent,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { DEVICE_TYPE, useIsPortrait } from 'app/hooks/DeviceProperties';
import { StyleSheet } from 'react-native';

export default function LoginCard({
  onRegister,
}: {
  onRegister: (event: GestureResponderEvent) => void;
}) {
  const isPortrait = useIsPortrait();

  const cardStyle = StyleSheet.create({
    phonePortrait: {
      width: '80%',
    },
    phoneLandscape: {
      width: '40%',
    },
    tabletPortrait: {
      width: '50%',
    },
    tabletLandscape: {
      width: '40%',
    },
  });
  let style = null;
  if (DEVICE_TYPE === 'Phone' && isPortrait) {
    style = cardStyle.phonePortrait;
  } else if (DEVICE_TYPE === 'Phone' && !isPortrait) {
    style = cardStyle.phoneLandscape;
  } else if (DEVICE_TYPE === 'Tablet' && isPortrait) {
    style = cardStyle.tabletPortrait;
  } else if (DEVICE_TYPE === 'Tablet' && !isPortrait) {
    style = cardStyle.tabletLandscape;
  } else {
    console.log('Your device does not have a default supported style.');
    return;
  }

  return (
    <View
      className="relative m-2 flex flex-col items-center justify-center rounded-3xl bg-gray-100 p-4 shadow-lg"
      style={style}>
      {/* <View className="m-2 mb-6 mt-6 flex h-15 w-15 items-center justify-center overflow-hidden rounded-full">
        <Image source={require('../assets/recordthesehandsicon.png')} className="h-17.25 w-17.25" />
      </View> */}
      <Text className="mb-4 mt-6 text-2xl font-bold text-neutral-800">Log In</Text>
      <View className="m-2 mb-4 ml-4 mr-4 flex w-8/10 flex-col">
        <Text className="mb-3 ml-2 items-center text-left font-bold text-neutral-500">Email</Text>
        <TextInput
          placeholder="Enter Email"
          inputMode="email"
          className="rounded-xl border border-neutral-200 pl-2"
          style={{ paddingLeft: 12 }}
        />
      </View>
      <View className="m-2 mb-10 ml-4 mr-4 flex w-8/10 flex-col">
        <Text className="mb-3 ml-2 items-center text-left font-bold text-neutral-500">
          Password
        </Text>
        <TextInput
          secureTextEntry
          placeholder="Enter Password"
          className="rounded-xl border border-neutral-200 pl-2"
          style={{ paddingLeft: 12 }}
        />
      </View>
      <Pressable
        className="mb-4 flex h-10 w-8/10 items-center justify-center rounded-xl bg-slate-800"
        onPress={() => router.replace('/(tabs)/')}>
        <Text className="text-center font-bold text-white">Log In</Text>
      </Pressable>
      <View className="mb-2 flex flex-row justify-center">
        <Text className="h-fill items-center p-1 text-center text-sm text-neutral-400">
          Don&apos;t have an account?{' '}
          <Pressable className="h-fill w-fill flex justify-center" onPress={onRegister}>
            <Text className="font-bold text-amber-300 underline">Sign Up</Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );
}
