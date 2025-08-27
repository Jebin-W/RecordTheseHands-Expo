import { Tabs } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { View, useWindowDimensions, Animated, PanResponder } from 'react-native';
import useAutoHideTabBar from 'app/hooks/AutoHideTabBar';

export default function TabLayout() {
  const { tapGestureResponder, slideAnimation } = useAutoHideTabBar();

  return (
    <View style={{ flex: 1 }} {...tapGestureResponder.panHandlers}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#fde68a',
          tabBarInactiveTintColor: '#6b7280',
          tabBarStyle: {
            backgroundColor: '#010617',
            borderColor: '#020717',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: 'absolute',
            transform: [{ translateY: slideAnimation }],
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 700,
            color: '#fde68a',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
          }}
        />
        <Tabs.Screen
          name="RecordingSession"
          options={{
            title: 'Prompts',
            tabBarLabel: 'Prompts',
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: 'Profile',
            tabBarLabel: 'Profile',
          }}
        />
      </Tabs>
    </View>
  );
}
