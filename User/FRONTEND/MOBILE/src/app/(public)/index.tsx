import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { Button } from '../../components/ui/Button';

export default function PublicHomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heroTitle}>Workder Mobile</Text>
      <Text style={styles.heroSub}>Find jobs and opportunities easily</Text>
      
      <View style={styles.btnGroup}>
        <Link href="/(auth)/login" asChild>
          <Button title="Login Mode" />
        </Link>
        <Link href="/(auth)/register" asChild>
          <Button title="Create Account" variant="secondary" style={styles.spacer} />
        </Link>
      </View>

      <View style={styles.menuGrid}>
        <Link href="/(public)/about" asChild><Button title="About" variant="secondary" style={styles.menuBtn}/></Link>
        <Link href="/(public)/premium" asChild><Button title="Premium" variant="secondary" style={styles.menuBtn}/></Link>
        <Link href="/(public)/safezone" asChild><Button title="Safezone" variant="secondary" style={styles.menuBtn}/></Link>
        <Link href="/(public)/work" asChild><Button title="Work" variant="secondary" style={styles.menuBtn}/></Link>
        <Link href="/(public)/map" asChild><Button title="Map" variant="secondary" style={styles.menuBtn}/></Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingTop: 60 },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#007AFF', textAlign: 'center', marginBottom: 8 },
  heroSub: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  btnGroup: { marginBottom: 40 },
  spacer: { marginTop: 16 },
  menuGrid: { flexDirection: 'column', gap: 12 },
  menuBtn: { width: '100%' },
});
