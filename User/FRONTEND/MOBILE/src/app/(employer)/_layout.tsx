import { Tabs } from 'expo-router';
import { Home, Briefcase, Wallet, Map } from 'lucide-react-native';

export default function EmployerLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true, tabBarActiveTintColor: '#FF9500' }}>
      <Tabs.Screen 
        name="dashboard" 
        options={{ 
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }} 
      />
      <Tabs.Screen 
        name="jobs" 
        options={{ 
          title: 'Jobs',
          tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
        }} 
      />
      <Tabs.Screen 
        name="wallet" 
        options={{ 
          title: 'Wallet',
          tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
        }} 
      />
      <Tabs.Screen 
        name="employer-map" 
        options={{ 
          title: 'Map',
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }} 
      />
    </Tabs>
  );
}
