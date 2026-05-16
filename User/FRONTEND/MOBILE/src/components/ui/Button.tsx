import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export function Button({ title, variant = 'primary', loading, style, disabled, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  const backgroundColor = disabled || loading 
    ? '#a1c9f2' 
    : isDanger 
      ? '#ff3b30' 
      : isPrimary 
        ? '#007AFF' 
        : '#E5E5EA';
        
  const textColor = isPrimary || isDanger ? '#fff' : '#007AFF';

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
