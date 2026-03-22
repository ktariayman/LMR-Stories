import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { appConfig } from '../../src/config/appConfig';
import { Colors } from '../../src/constants/colors';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', height: 40 }}>
      <Text style={{
        fontSize: 26,
        transform: [{ scale: focused ? 1.2 : 1 }],
        opacity: focused ? 1 : 0.55,
      }}>
        {emoji}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1.5,
          height: 82,
          paddingBottom: 16,
          paddingTop: 8,
          elevation: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '800',
          marginTop: 2,
        },
      }}
    >
      {/* Always shown */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Stories',
          tabBarLabel: 'Stories',
          tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} />,
        }}
      />

      {/* Community tab — config-gated */}
      <Tabs.Screen
        name="community"
        options={appConfig.enableCommunity ? {
          title: 'Community',
          tabBarLabel: 'Community',
          tabBarIcon: ({ focused }) => <TabIcon emoji="🌟" focused={focused} />,
        } : { href: null }}
      />

      {/* AI Generate tab — config-gated */}
      <Tabs.Screen
        name="generate"
        options={appConfig.enableAI ? {
          title: 'Create',
          tabBarLabel: 'Create',
          tabBarIcon: ({ focused }) => <TabIcon emoji="✨" focused={focused} />,
        } : { href: null }}
      />

      {/* Always shown */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />

      {/* Hidden stack screens — tab bar stays visible */}
      <Tabs.Screen name="story/[id]" options={{ href: null, tabBarStyle: { display: 'flex', backgroundColor: Colors.white, borderTopColor: Colors.border, borderTopWidth: 1.5, height: 82, paddingBottom: 16, paddingTop: 8, elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12 } }} />
      <Tabs.Screen name="quiz/[id]" options={{ href: null, tabBarStyle: { display: 'flex', backgroundColor: Colors.white, borderTopColor: Colors.border, borderTopWidth: 1.5, height: 82, paddingBottom: 16, paddingTop: 8, elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12 } }} />
      <Tabs.Screen name="community/write" options={{ href: null, tabBarStyle: { display: 'flex', backgroundColor: Colors.white, borderTopColor: Colors.border, borderTopWidth: 1.5, height: 82, paddingBottom: 16, paddingTop: 8, elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12 } }} />
    </Tabs>
  );
}
