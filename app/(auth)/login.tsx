import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginCard from '../components/LoginCard';

export default function LoginScreen() {
  return (
    <View className="h-screen flex-1 bg-amber-400">
      <SafeAreaView className="flex-1 items-center justify-center">
        <LoginCard onRegister={() => router.push('/(auth)/register')} />
      </SafeAreaView>
    </View>
  );
}
