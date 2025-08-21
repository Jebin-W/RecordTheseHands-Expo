import { useEffect, useRef, useState } from 'react';
import { Animated, PanResponder, useWindowDimensions } from 'react-native';

export default function useAutoHideTabBar() {
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const { height } = useWindowDimensions();

  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    setIsTabBarVisible(true);
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    console.log('Tab bar shown, timer reset');
    inactivityTimer.current = setTimeout(() => {
      Animated.timing(slideAnimation, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsTabBarVisible(false);
        console.log('Tab bar hidden after inactivity');
      });
    }, 2000);
  };

  const tapGestureResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        const { locationY } = event.nativeEvent;
        console.log('Touch detected at:', locationY, 'Screen height:', height);

        if (locationY > height * 0.9) {
          console.log('Touch from bottom detected - showing tab bar');
          resetInactivityTimer();
        }
      },
    })
  ).current;

  // Initialize timer on mount and clean up on unmount
  useEffect(() => {
    console.log('TabLayout mounted - starting inactivity timer');
    resetInactivityTimer();
    return () => {
      console.log('TabLayout unmounting - clearing timer');
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, []);

  return {
    tapGestureResponder,
    slideAnimation,
    isTabBarVisible,
    resetInactivityTimer,
  };
}
