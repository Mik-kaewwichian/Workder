import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';

export default function UserDashboardScreen() {
  const { name, logout } = useAuthStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.greeting}>Hello, {name || 'User'}</Text>
        <Text style={styles.subtitle}>Welcome to your Workder Dashboard</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Work</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You have no upcoming jobs.</Text>
          <Button title="Explore Jobs" style={styles.actionBtn} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Setup</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Profile KYC is verified ✓</Text>
        </View>
      </View>

      <Button title="Logout" variant="danger" onPress={logout} style={styles.logoutBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { padding: 16 },
  headerCard: { backgroundColor: '#007AFF', padding: 24, borderRadius: 16, marginBottom: 24 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#e5e5ea' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  emptyState: { backgroundColor: '#fff', padding: 32, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#8e8e93', marginBottom: 16 },
  actionBtn: { width: 150 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  cardText: { color: '#34c759', fontWeight: 'bold' },
  logoutBtn: { marginTop: 16 }
});
