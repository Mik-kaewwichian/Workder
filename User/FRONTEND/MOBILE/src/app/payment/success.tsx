import { View, Text } from 'react-native';

export default function Success() {
  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Payment Success</Text>
    </View>
  );
}
