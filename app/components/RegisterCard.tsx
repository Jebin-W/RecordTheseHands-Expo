import { View, Text, TextInput, Image, Pressable, GestureResponderEvent } from 'react-native';
import { router } from 'expo-router';

export default function RegisterCard({
  onLogin,
}: {
  onLogin: (event: GestureResponderEvent) => void;
}) {
  return (
    <View className="relative m-2 flex w-8/10 flex-col items-center justify-center rounded-3xl bg-white p-4 shadow-lg">
      {/* <View className="m-2 mb-6 mt-6 flex h-15 w-15 items-center justify-center overflow-hidden rounded-full">
        <Image source={require('../assets/recordthesehandsicon.png')} className="h-17.25 w-17.25" />
      </View> */}
      <Text className="mb-4 mt-6 text-2xl font-bold text-neutral-800">Register</Text>
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
        onPress={() => router.replace('/(tabs)')}>
        <Text className="text-center font-bold text-white">Register</Text>
      </Pressable>
      <View className="mb-2 flex w-8/10 flex-row justify-center">
        <Text className="h-fill items-center p-1 text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <Pressable className="bg-transparent" onPress={onLogin}>
            <Text className="font-bold text-amber-300 underline">Log In</Text>
          </Pressable>
        </Text>
      </View>
    </View>
  );
}
