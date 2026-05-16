import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';

export default function Index() {
  const { accessToken, role } = useAuthStore();

  if (accessToken) {
    if (role === 'employer') {
      return <Redirect href="/(employer)/dashboard" />;
    }
    return <Redirect href="/(user)/dashboard" />;
  }

  // If no auth, go to public stack
  return <Redirect href="/(public)" />;
}
