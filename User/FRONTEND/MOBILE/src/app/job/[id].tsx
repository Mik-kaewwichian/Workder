import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export default function JobDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Job Detail</Text>
      <Text>Job ID: {id}</Text>
    </View>
  );
}
