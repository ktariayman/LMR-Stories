import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 45 }}>
      <Text style={{ 
        fontSize: 28, 
        transform: [{ scale: focused ? 1.2 : 1 }],
        opacity: focused ? 1 : 0.6 
      }}>
        {emoji}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF8C00',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F0E0D0',
          borderTopWidth: 2,
          height: 100,
          paddingBottom: 30, // Extra space for home bar/notches
          paddingTop: 12,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.12,
          shadowRadius: 10,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: '900',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Stories',
          tabBarLabel: 'Stories',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="generate"
        options={{
          title: 'Create',
          tabBarLabel: 'Create',
          tabBarIcon: ({ focused }) => <TabIcon emoji="✨" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="story/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="quiz/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
