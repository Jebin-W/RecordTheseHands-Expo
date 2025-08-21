import { router } from 'expo-router';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoginCard from '../components/LoginCard';
import RegisterCard from '../components/RegisterCard';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { DEVICE_TYPE, useIsPortrait } from 'app/hooks/DeviceProperties';

export default function AuthScreen() {
  const [showRegister, setShowRegister] = useState(false);
  const cardOpacity = useSharedValue(0);

  const isPortrait = useIsPortrait();

  const cardSwitchAnimation = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
  }));

  useEffect(() => {
    cardOpacity.value = withTiming(1, { duration: 200 });
  }, [showRegister]);

  return (
    <LinearGradient
      className="h-screen flex-1 flex-col"
      colors={['#020617', '#334155']}
      start={{ x: 1, y: 1 }}
      end={{ x: 0, y: 0 }}>
      <SafeAreaView className="relative flex-1 items-center justify-center">
        <Text
          className="absolute text-nowrap text-4xl font-black text-amber-200"
          style={{ top: isPortrait && DEVICE_TYPE === 'Tablet' ? 300 : 100 }}>
          RecordTheseHands
        </Text>
        <Animated.View
          style={[cardSwitchAnimation]}
          className="w-full flex-1 items-center justify-center">
          {!showRegister ? (
            <LoginCard onRegister={() => setShowRegister(true)} />
          ) : (
            <RegisterCard onLogin={() => setShowRegister(false)} />
          )}
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}
