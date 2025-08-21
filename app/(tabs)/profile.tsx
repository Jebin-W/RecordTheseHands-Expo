import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const handleLogout = () => {
    router.replace('/(auth)/auth');
  };

  return (
    <LinearGradient
      className="h-screen w-screen flex-col"
      colors={['#020617', '#334155']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}>
      <SafeAreaView className="flex flex-1 items-center justify-center">
        <View className="h-3/10 w-8/10 items-center justify-center rounded-xl bg-white p-4">
          <Text className="mb-8 text-2xl font-bold text-gray-800">Profile</Text>

          <View className="w-full max-w-xs">
            <Text className="mb-2 text-gray-600">User Email:</Text>
            <Text className="mb-8 text-lg font-medium">user@example.com</Text>

            <Pressable
              className="items-center rounded-lg bg-red-500 px-6 py-3"
              onPress={handleLogout}>
              <Text className="font-bold text-white">Logout</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
