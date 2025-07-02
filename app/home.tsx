import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../api/api';

const defaultUserImage = require('../assets/images/user.png');

interface Birthday {
  id: number;
  name: string;
  birthday_date: string;
  relationship?: string;
  photo?: string;
}

export default function HomeScreen() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await api.get('/birthdays');
        setBirthdays(response.data);
      } catch (error: any) {
        console.log('Error al obtener cumpleaños', error.response?.data || error.message);
        Alert.alert('Error', 'No se pudo obtener la lista de cumpleaños');
      } finally {
        setLoading(false);
      }
    };

    fetchBirthdays();
  }, []);

  const handleDelete = async (id: number) => {
    Alert.alert('¿Eliminar?', '¿Estás seguro que deseas eliminar este cumpleaños?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/birthdays/${id}`);
            setBirthdays((prev) => prev.filter((b) => b.id !== id));
            Alert.alert('Eliminado', 'Cumpleaños eliminado correctamente');
          } catch (error: any) {
            console.log(error.response?.data || error.message);
            Alert.alert('Error', 'No se pudo eliminar el cumpleaños');
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    Alert.alert('Cerrar sesión', '¿Quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.post('/logout');
          } catch {}
          await AsyncStorage.removeItem('token');
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Birthday }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={item.photo ? { uri: item.photo } : defaultUserImage}
          style={styles.photo}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.birthdayDate}>🎂 {item.birthday_date}</Text>
          {item.relationship && (
            <Text style={styles.relationship}>🤝 {item.relationship}</Text>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push(`/birthday/${item.id}/edit`)}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => router.push(`/birthday/${item.id}/view`)}
        >
          <Text style={styles.buttonText}>Ver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>🎉 Lista de Cumpleaños</Text>

        {/* Botón del menú */}
        <TouchableOpacity style={styles.menuIcon} onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#512DA8" style={{ marginTop: 50 }} />
      ) : birthdays.length === 0 ? (
        <Text style={styles.emptyText}>No tienes cumpleaños registrados aún.</Text>
      ) : (
        <FlatList
          data={birthdays}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <TouchableOpacity
          onPress={() => router.push('/birthday/create')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>➕ Agregar cumpleaños</Text>
        </TouchableOpacity>
      </View>

      {/* Modal del Menú */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/giftshops');
              }}
            >
              <Text style={styles.menuItemText}>🎁 Ver tiendas de regalos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/birthday/calendar');
              }}
            >
              <Text style={styles.menuItemText}>📅 Calendario de cumpleaños</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push('/settings');
              }}
            >
              <Text style={styles.menuItemText}>⚙️ Configuración</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                handleLogout();
              }}
            >
              <Text style={styles.menuItemText}>🚪 Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: '#EDE7F6',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#512DA8',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 40,
    color: '#7E57C2',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#F3E5F5',
    borderRadius: 14,
    padding: 18,
    marginBottom: 15,
    shadowColor: '#512DA8',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  photo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 15,
    backgroundColor: '#CCC',
  },
  name: {
    fontSize: 19,
    fontWeight: '700',
    color: '#4A148C',
  },
  birthdayDate: {
    color: '#7E57C2',
    marginTop: 2,
    fontSize: 15,
  },
  relationship: {
    color: '#9575CD',
    marginTop: 1,
    fontSize: 14,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
    gap: 10,
  },
  editButton: {
    backgroundColor: '#7E57C2',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginRight: 14,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  viewButton: {
    backgroundColor: '#03A9F4',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginRight: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#512DA8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#512DA8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 30,
  },
  menuIcon: {
    backgroundColor: '#512DA8',
    padding: 10,
    borderRadius: 30,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  menu: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  menuItem: {
    paddingVertical: 14,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#512DA8',
  },
});
