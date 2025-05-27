import { useGlobalContext } from '@/lib/global-provider';
import { Redirect, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';

export default function AhliGiziLayout() {
  const { user, isNutritionist, loading } = useGlobalContext();

  // Show loading state
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Loading state handled by child screens */}
      </View>
    );
  }

  // Redirect if not logged in or not a nutritionist
  if (!user || !isNutritionist) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="dashboard"
        options={{
          title: 'Dashboard Ahli Gizi',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          title: 'Profil Ahli Gizi',
        }}
      />
    </Stack>
  );
}
