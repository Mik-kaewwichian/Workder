import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' }
  });

  const mutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const resp = await apiClient.post('/auth/register', { 
        email: data.email, 
        password: data.password,
        role: 'user' // Default to user for registration
      });
      return resp.data;
    },
    onSuccess: (data) => {
      setSession({
        userId: data.user.id,
        email: data.user.email,
        role: data.user.role,
        profileCompleted: data.user.profileCompleted || false,
        name: data.user.firstName + ' ' + data.user.lastName,
        accessToken: data.accessToken,
      });
    },
    onError: (err: any) => {
      Alert.alert('Registration Failed', err.response?.data?.message || 'Network error');
    }
  });

  const onSubmit = (data: RegisterFormData) => {
    mutation.mutate(data);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Workder today</Text>
          
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

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirm Password"
                placeholder="••••••••"
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.confirmPassword?.message}
              />
            )}
          />
          
          <Button 
            title="Register" 
            onPress={handleSubmit(onSubmit)} 
            loading={mutation.isPending}
            style={styles.registerBtn}
          />
          
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Text style={styles.linkTextBold}>Login</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9'},
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  formContainer: { padding: 24, backgroundColor: '#fff', margin: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  registerBtn: { marginTop: 16, marginBottom: 24 },
  linkContainer: { flexDirection: 'row', justifyContent: 'center' },
  linkText: { color: '#666' },
  linkTextBold: { color: '#007AFF', fontWeight: 'bold' },
});
