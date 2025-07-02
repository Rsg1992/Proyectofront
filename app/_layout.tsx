import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  const [fontsLoaded] = useFonts({
    Roboto: require('../assets/fonts/Roboto-Regular.ttf'),
    RobotoMedium: require('../assets/fonts/Roboto-Medium.ttf'),
    RobotoLight: require('../assets/fonts/Roboto-Light.ttf'),
  });

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setHasToken(!!token);
      setIsLoading(false);
    };

    checkToken();
  }, []);

  if (!fontsLoaded) {
    return null; // O algún loader mientras cargan las fuentes
  }

  return (
    <Stack
      initialRouteName="splash" // Forzar que la primera pantalla sea splash
      screenOptions={{ headerShown: false }}
    >
      {/* Splash siempre está declarado */}
      <Stack.Screen name="splash" />

      {/* Pantallas auth y tabs solo se muestran cuando isLoading es false */}
      {!isLoading && (
        <>
          {hasToken ? (
            <Stack.Screen name="(tabs)" />
          ) : (
            <>
              <Stack.Screen name="(auth)/login" />
              <Stack.Screen name="(auth)/register" />
            </>
          )}
        </>
      )}
    </Stack>
  );
}
