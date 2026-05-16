import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { useRouter } from 'expo-router';

// Supports Thai address formatting
const profileSchema = z.object({
  firstName: z.string().min(2, 'Require First Name'),
  lastName: z.string().min(2, 'Require Last Name'),
  phone: z.string().min(10, 'Require valid phone'),
  province: z.string().min(2, 'Require Province (จังหวัด)'),
  district: z.string().min(2, 'Require District (อำเภอ)'),
  subDistrict: z.string().min(2, 'Require Sub-district (ตำบล)'),
  zipCode: z.string().length(5, 'Require 5 digit ZIP (รหัสไปรษณีย์)'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileRegisterScreen() {
  const router = useRouter();
  const { userId, setSession } = useAuthStore();
  
  const [images, setImages] = useState({
    idCardFront: null as string | null,
    idCardBack: null as string | null,
    idCardSelfie: null as string | null,
    faceScan: null as string | null,
  });

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '', lastName: '', phone: '',
      province: '', district: '', subDistrict: '', zipCode: ''
    }
  });

  const pickImage = async (key: keyof typeof images) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages(prev => ({ ...prev, [key]: result.assets[0].uri }));
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      // Create form data to upload images + JSON
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      // Append images Mock since FormData needs React Native specific shaping usually for files
      Object.entries(images).forEach(([key, uri]) => {
        if (uri) {
          formData.append(key, {
            uri,
            name: `${key}.jpg`,
            type: 'image/jpeg',
          } as any);
        }
      });
      
      const resp = await apiClient.patch(`/users/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return resp.data;
    },
    onSuccess: (data) => {
      setSession({ profileCompleted: true, name: `${data.firstName} ${data.lastName}` });
      Alert.alert('Success', 'Profile Completed');
      router.replace('/(user)/dashboard');
    },
    onError: (err: any) => {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update profile');
    }
  });

  const onSubmit = (data: ProfileFormData) => {
    if (!images.idCardFront || !images.idCardBack || !images.idCardSelfie || !images.faceScan) {
      Alert.alert('Validation Error', 'Please upload all 4 required KYC images.');
      return;
    }
    mutation.mutate(data);
  };

  const renderImagePicker = (label: string, key: keyof typeof images) => (
    <View style={styles.imagePickerContainer}>
      <Text style={styles.imageLabel}>{label}</Text>
      <TouchableOpacity style={styles.imageBox} onPress={() => pickImage(key)}>
        {images[key] ? (
          <Image source={{ uri: images[key]! }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholderText}>+ Tap to upload</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Complete Your Profile</Text>
      <Text style={styles.subtitle}>KYC and Address Information</Text>

      <Controller control={control} name="firstName" render={({ field: { onChange, value } }) => (
        <Input label="First Name" onChangeText={onChange} value={value} error={errors.firstName?.message} />
      )} />
      
      <Controller control={control} name="lastName" render={({ field: { onChange, value } }) => (
        <Input label="Last Name" onChangeText={onChange} value={value} error={errors.lastName?.message} />
      )} />

      <Controller control={control} name="phone" render={({ field: { onChange, value } }) => (
        <Input label="Phone" keyboardType="phone-pad" onChangeText={onChange} value={value} error={errors.phone?.message} />
      )} />

      <Text style={styles.sectionTitle}>Address (Thai Support)</Text>
      
      <Controller control={control} name="province" render={({ field: { onChange, value } }) => (
        <Input label="Province (จังหวัด)" onChangeText={onChange} value={value} error={errors.province?.message} />
      )} />
      <Controller control={control} name="district" render={({ field: { onChange, value } }) => (
        <Input label="District (อำเภอ)" onChangeText={onChange} value={value} error={errors.district?.message} />
      )} />
      <Controller control={control} name="subDistrict" render={({ field: { onChange, value } }) => (
        <Input label="Sub-district (ตำบล)" onChangeText={onChange} value={value} error={errors.subDistrict?.message} />
      )} />
      <Controller control={control} name="zipCode" render={({ field: { onChange, value } }) => (
        <Input label="ZIP Code (รหัสไปรษณีย์)" keyboardType="number-pad" onChangeText={onChange} value={value} error={errors.zipCode?.message} />
      )} />

      <Text style={styles.sectionTitle}>KYC Verification</Text>
      {renderImagePicker('ID Card Front', 'idCardFront')}
      {renderImagePicker('ID Card Back', 'idCardBack')}
      {renderImagePicker('Selfie with ID', 'idCardSelfie')}
      {renderImagePicker('Face Scan', 'faceScan')}

      <Button 
        title="Submit Profile" 
        onPress={handleSubmit(onSubmit)} 
        loading={mutation.isPending} 
        style={styles.submitBtn} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 12 },
  imagePickerContainer: { marginBottom: 16 },
  imageLabel: { marginBottom: 8, fontWeight: '500' },
  imageBox: { height: 120, borderWidth: 1, borderStyle: 'dashed', borderColor: '#ccc', borderRadius: 8, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9'},
  imagePlaceholderText: { color: '#007AFF', fontWeight: '500' },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  submitBtn: { marginTop: 24 }
});
