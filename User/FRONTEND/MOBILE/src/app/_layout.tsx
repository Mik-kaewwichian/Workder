import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

const queryClient = new QueryClient();

export default function RootLayout() {
  const { accessToken, role, profileCompleted } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Basic state ready (Assuming persist hydrated)
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inUserGroup = segments[0] === '(user)';
    const inEmployerGroup = segments[0] === '(employer)';

    if (!accessToken && (inUserGroup || inEmployerGroup)) {
      router.replace('/(auth)/login');
    } else if (accessToken) {
      if (inAuthGroup) {
        if (role === 'employer') {
          router.replace('/(employer)/dashboard');
        } else {
          router.replace('/(user)/dashboard');
        }
      }
      
      // Role strictness
      if (role === 'user' && inEmployerGroup) {
        router.replace('/(user)/dashboard');
      } else if (role === 'employer' && inUserGroup) {
        router.replace('/(employer)/dashboard');
      }
      
      // Profile Completion Gating
      if (role === 'user' && !profileCompleted && inUserGroup && segments[1] !== 'profile-register') {
        router.replace('/(user)/profile-register');
      }
    }
  }, [accessToken, role, profileCompleted, segments, isReady]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
