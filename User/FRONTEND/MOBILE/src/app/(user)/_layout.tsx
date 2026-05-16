import { Tabs } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { Home, Bell, User as UserIcon } from 'lucide-react-native';

export default function UserLayout() {
  const { profileCompleted } = useAuthStore();

  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          // Hide tab if profile is not completed
          href: profileCompleted ? '/(user)/dashboard' : null,
        }} 
      />
      <Tabs.Screen 
        name="notifications" 
        options={{ 
          title: 'Notifications',
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
          href: profileCompleted ? '/(user)/notifications' : null,
        }} 
      />
      <Tabs.Screen 
        name="profile-register" 
        options={{ 
          title: 'Profile KYC',
          tabBarIcon: ({ color, size }) => <UserIcon color={color} size={size} />,
          // Usually hidden from tabs once completed, up to specific requirements
          href: !profileCompleted ? '/(user)/profile-register' : null,
        }} 
      />
    </Tabs>
  );
}
