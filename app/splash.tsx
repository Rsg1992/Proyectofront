import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Splash() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/login')}>
        <Text style={styles.loginButtonText}>Iniciar sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
        <Text style={styles.registerText}>¿No tienes cuenta? <Text style={styles.registerLink}>¡Regístrate!</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6', // lila claro
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
  width: 300,
  height: 300,
  borderRadius: 150,
  resizeMode: 'cover',
  marginBottom: 50,
},
  loginButton: {
    backgroundColor: '#7E57C2', // lila oscuro
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    fontSize: 16,
    color: '#5E35B1', // lila intermedio
    textAlign: 'center',
  },
  registerLink: {
    color: '#512DA8', // lila profundo
    fontWeight: 'bold',
  },
});
