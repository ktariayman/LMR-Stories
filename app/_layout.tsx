import { useEffect, useState } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../src/store/useAuthStore';
import { appConfig } from '../src/config/appConfig';
import { Colors } from '../src/constants/colors';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import OnboardingScreen from '../src/screens/OnboardingScreen';

const ONBOARDING_KEY = 'lmr_onboarding_complete';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, restoreSession } = useAuthStore();
  const segments = useSegments();
  const [initialized, setInitialized] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    async function init() {
      const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
      setShowOnboarding(seen !== 'true');
      await restoreSession();
      setInitialized(true);
    }
    init();
  }, []);

  useEffect(() => {
    if (!initialized || showOnboarding) return;
    const inAuthGroup = segments[0] === '(auth)';

    if (appConfig.requireAuth && !user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/');
    }
  }, [user, initialized, segments, showOnboarding]);

  if (!initialized || showOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onComplete={async () => {
          await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
          setShowOnboarding(false);
        }}
      />
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <AuthGuard>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </AuthGuard>
        </SafeAreaProvider>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
