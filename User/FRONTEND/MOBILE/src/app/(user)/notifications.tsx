import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

// Mock offline cache structure for notifications
const mockNotifications = [
  { id: '1', title: 'Welcome to Workder', body: 'Complete your profile to start finding jobs.', read: false },
  { id: '2', title: 'KYC Verified', body: 'Your identity has been successfully verified.', read: true },
];

export default function NotificationsScreen() {
  const { data: notifications, isLoading, refetch, isError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Simulate API call that might fail offline
      const resp = await apiClient.get('/notifications');
      return resp.data;
    },
    initialData: mockNotifications, // Provides instant UI (Local Cache mock)
    staleTime: 60000, // 1 minute
  });

  const renderItem = ({ item }: any) => (
    <View style={[styles.notificationCard, !item.read && styles.unreadCard]}>
      <Text style={[styles.title, !item.read && styles.unreadText]}>{item.title}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Offline mode. Showing cached data.</Text>
        </View>
      )}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  listContent: { padding: 16 },
  notificationCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  unreadCard: { borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#333' },
  unreadText: { fontWeight: 'bold', color: '#000' },
  body: { fontSize: 14, color: '#666' },
  errorBanner: { backgroundColor: '#ffcc00', padding: 8, alignItems: 'center' },
  errorText: { fontSize: 12, color: '#333', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 32, color: '#999' }
});
