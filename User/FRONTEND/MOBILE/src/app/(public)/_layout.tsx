import { Stack } from 'expo-router';

export default function PublicLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="premium" options={{ title: 'Premium' }} />
      <Stack.Screen name="safezone" options={{ title: 'Safezone' }} />
      <Stack.Screen name="work" options={{ title: 'Work' }} />
      <Stack.Screen name="map" options={{ title: 'Map' }} />
    </Stack>
  );
}
