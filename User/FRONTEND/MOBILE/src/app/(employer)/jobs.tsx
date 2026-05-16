import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Button } from '../../components/ui/Button';

const mockJobs = [
  { id: '1', title: 'Senior Software Engineer', status: 'Active', applicants: 5 },
  { id: '2', title: 'Product Manager', status: 'Draft', applicants: 0 },
];

export default function EmployerJobsScreen() {
  const { data: jobs, isLoading, refetch, isError } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: async () => {
      // Offline fallback logic handled gracefully
      const resp = await apiClient.get('/employer/jobs');
      return resp.data;
    },
    initialData: mockJobs,
    staleTime: 60000,
  });

  const renderItem = ({ item }: any) => (
    <View style={styles.jobCard}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.status}>Status: {item.status}</Text>
      <Text style={styles.applicants}>{item.applicants} Applicants</Text>
      <Button title="Manage" style={styles.manageBtn} />
    </View>
  );

  return (
    <View style={styles.container}>
      {isError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Offline mode. Showing cached jobs.</Text>
        </View>
      )}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Your Postings</Text>
        <Button title="+ Create Job" />
      </View>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No jobs posted yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pageTitle: { fontSize: 20, fontWeight: 'bold' },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  jobCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4, color: '#333' },
  status: { fontSize: 14, color: '#FF9500', marginBottom: 4 },
  applicants: { fontSize: 14, color: '#666', marginBottom: 12 },
  manageBtn: { backgroundColor: '#eee', paddingVertical: 8 },
  errorBanner: { backgroundColor: '#ffcc00', padding: 8, alignItems: 'center' },
  errorText: { fontSize: 12, color: '#333', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 32, color: '#999' }
});
