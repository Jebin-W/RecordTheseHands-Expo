import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterCard from '../components/RegisterCard';

export default function RegisterScreen() {
  return (
    <View className="h-screen flex-1 bg-amber-400">
      <SafeAreaView className="flex-1 items-center justify-center">
        <RegisterCard onLogin={() => router.back()} />
      </SafeAreaView>
    </View>
  );
}
