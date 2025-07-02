// app/birthday/[id]/view.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../../api/api';

interface Birthday {
  id: number;
  name: string;
  birthday_date: string;
  relationship?: string;
  photo?: string;
}

export default function ViewBirthday() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [birthday, setBirthday] = useState<Birthday | null>(null);

  useEffect(() => {
    const fetchBirthday = async () => {
      try {
        const response = await api.get(`/birthdays/${id}`);
        setBirthday(response.data);
      } catch (error: any) {
        Alert.alert('Error', 'No se pudo cargar el cumpleaños');
      }
    };

    fetchBirthday();
  }, [id]);

  if (!birthday) return <Text style={styles.loadingText}>Cargando...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎈 Detalles del Cumpleañero</Text>

      {birthday.photo ? (
        <Image source={{ uri: birthday.photo }} style={styles.photo} />
      ) : (
        <View style={styles.placeholderPhoto}>
          <Text style={styles.placeholderText}>Sin foto</Text>
        </View>
      )}

      <Text style={styles.label}>👤 Nombre:</Text>
      <Text style={styles.value}>{birthday.name}</Text>

      <Text style={styles.label}>🎂 Fecha de cumpleaños:</Text>
      <Text style={styles.value}>{birthday.birthday_date}</Text>

      {birthday.relationship && (
        <>
          <Text style={styles.label}>🤝 Relación:</Text>
          <Text style={styles.value}>{birthday.relationship}</Text>
        </>
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>⬅️ Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#EDE7F6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#512DA8',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    fontSize: 16,
    color: '#512DA8',
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
    backgroundColor: '#CCC',
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#888',
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#7E57C2',
    padding: 12,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
    color: '#555',
  },
});
