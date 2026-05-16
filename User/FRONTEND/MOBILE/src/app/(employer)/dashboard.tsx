import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';

export default function EmployerDashboardScreen() {
  const { name, logout } = useAuthStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.greeting}>Employer Portal</Text>
        <Text style={styles.subtitle}>{name}</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Active Jobs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Applicants</Text>
        </View>
      </View>

      <Button title="Logout" variant="danger" onPress={logout} style={styles.logoutBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { padding: 16 },
  headerCard: { backgroundColor: '#FF9500', padding: 24, borderRadius: 16, marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#ffe5cc' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', marginHorizontal: 4 },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#FF9500', marginBottom: 8 },
  statLabel: { fontSize: 14, color: '#666' },
  logoutBtn: { marginTop: 16 }
});
