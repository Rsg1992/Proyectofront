// app/hooks/useAppSettings.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useAppSettings() {
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedFont = await AsyncStorage.getItem('preferredFont');
      const storedTheme = await AsyncStorage.getItem('theme');

      if (storedFont) setFontFamily(storedFont);
      if (storedTheme) setIsDarkMode(storedTheme === 'dark');
      setIsReady(true);
    };

    loadSettings();
  }, []);

  return { fontFamily, isDarkMode, isReady };
}
