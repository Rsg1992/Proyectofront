import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

const AVAILABLE_FONTS = [
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Roboto Medium', value: 'RobotoMedium' },
  { label: 'Roboto Light', value: 'RobotoLight' },
];

export default function SettingsScreen() {
  const [selectedFont, setSelectedFont] = useState<string>('Roboto');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const router = useRouter();
  const systemScheme = useColorScheme();

  useEffect(() => {
    const loadSettings = async () => {
      const storedFont = await AsyncStorage.getItem('preferredFont');
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedFont) setSelectedFont(storedFont);
      if (storedTheme) setIsDarkMode(storedTheme === 'dark');
    };
    loadSettings();
  }, []);

  const handleFontChange = async (font: string) => {
    try {
      await AsyncStorage.setItem('preferredFont', font);
      setSelectedFont(font);
      Alert.alert('✅ Listo', 'Fuente actualizada');
    } catch {
      Alert.alert('Error', 'No se pudo guardar la fuente');
    }
  };

  const handleThemeToggle = async () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    await AsyncStorage.setItem('theme', newTheme);
    setIsDarkMode(!isDarkMode);
    Alert.alert('✅ Tema actualizado', `Modo ${newTheme === 'dark' ? 'oscuro' : 'claro'}`);
  };

  const backgroundColor = isDarkMode ? '#121212' : '#EDE7F6';
  const textColor = isDarkMode ? '#fff' : '#512DA8';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { fontFamily: selectedFont, color: textColor }]}>
        ⚙️ Configuración
      </Text>

      <Text style={[styles.subtitle, { fontFamily: selectedFont, color: textColor }]}>
        Tipo de letra:
      </Text>

      <FlatList
        data={AVAILABLE_FONTS}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.option,
              item.value === selectedFont && styles.optionSelected,
              { backgroundColor: item.value === selectedFont ? '#7E57C2' : '#fff' },
            ]}
            onPress={() => handleFontChange(item.value)}
          >
            <Text style={{ fontFamily: item.value, color: item.value === selectedFont ? '#fff' : '#512DA8' }}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.themeRow}>
        <Text style={[styles.subtitle, { fontFamily: selectedFont, color: textColor }]}>
          Modo oscuro:
        </Text>
        <Switch value={isDarkMode} onValueChange={handleThemeToggle} />
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 30, // <-- Añade un margen superior
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  option: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#512DA8',
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: '#7E57C2',
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
  },
  backButton: {
    marginTop: 50,
    backgroundColor: '#512DA8',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 30,
    marginBottom: 10, 
    
  },
});
