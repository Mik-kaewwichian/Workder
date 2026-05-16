import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useForm, Controller } from 'react-form-hook';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link, useRouter } from 'expo-router';

// We want to handle standard z.object, but user didn't request exhaustive zod forms unless asked,
// actually the task mentions "React Hook Form + Zod".

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const resp = await apiClient.post('/auth/login', data);
      return resp.data;
    },
    onSuccess: (data) => {
      // Data expected to match AuthState based on the existing backend API structure
      setSession({
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role,
        profileCompleted: data.user.profileCompleted || false,
        name: data.user.firstName + ' ' + data.user.lastName,
        accessToken: data.accessToken,
      });
      // Navigation is handled automatically by _layout.tsx based on session change
    },
    onError: (err: any) => {
      let msg = 'An unexpected error occurred';
      if (!err.response) {
        msg = 'Network error or server is down'; // Network/Server not responding
      } else if (err.response.status === 401 || err.response.status === 400) {
        msg = 'อีเมลหรือรหัสผ่านผิด'; // Invalid email or password requirement specifically requested
      }
      Alert.alert('Login Failed', msg);
    }
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to Workder</Text>
        
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="user@workder.com"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.email?.message}
            />
          )}
        />
        
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
            />
          )}
        />
        
        <Button 
          title="Login" 
          onPress={handleSubmit(onSubmit)} 
          loading={mutation.isPending}
          style={styles.loginBtn}
        />
        
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Text style={styles.linkTextBold}>Register</Text>
          </Link>
        </View>

        <View style={styles.oauthContainer}>
          <Text style={styles.oauthText}>Or login with Oauth is supported in later phases</Text>
          <Button title="Login with Google (Mock)" variant="secondary" onPress={() => Alert.alert('WIP')} style={{marginBottom: 10}} />
          <Button title="Login with Facebook (Mock)" variant="secondary" onPress={() => Alert.alert('WIP')} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', justifyContent: 'center' },
  formContainer: { padding: 24, backgroundColor: '#fff', margin: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  loginBtn: { marginTop: 16, marginBottom: 24 },
  linkContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 32 },
  linkText: { color: '#666' },
  linkTextBold: { color: '#007AFF', fontWeight: 'bold' },
  oauthContainer: { marginTop: 16, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 16 },
  oauthText: { textAlign: 'center', color: '#999', marginBottom: 16, fontSize: 12 }
});
