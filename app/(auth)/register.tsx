import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import api from '../../api/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('⚠️ Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      router.replace('/home');
    } catch (error: any) {
      console.log(error.response?.data);
      Alert.alert('❌ Registro fallido', error.response?.data?.message || 'Error inesperado');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🎉 ¡Crea tu cuenta!</Text>

        <TextInput
          style={styles.input}
          placeholder="👤 Nombre"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#AAA"
        />
        <TextInput
          style={styles.input}
          placeholder="📧 Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#AAA"
        />
        <TextInput
          style={styles.input}
          placeholder="🔒 Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#AAA"
        />
        <TextInput
          style={styles.input}
          placeholder="🔒 Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#AAA"
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>🚀 Registrarse</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.link} onPress={() => router.replace('/(auth)/login')}>
            Inicia sesión
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6', // lila claro
  },
  scroll: {
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#512DA8', // lila profundo
  },
  input: {
    height: 50,
    borderColor: '#7E57C2', // lila intermedio
    borderWidth: 2,
    backgroundColor: '#F3E5F5', // lila muy claro
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#512DA8', // lila profundo
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#512DA8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loginText: {
    textAlign: 'center',
    color: '#5E35B1', // lila intermedio
  },
  link: {
    color: '#7E57C2', // lila intermedio
    fontWeight: 'bold',
  },
});
