import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../../../api/api';

export default function EditBirthday() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [birthdayDate, setBirthdayDate] = useState<Date | null>(null);
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const d = date;
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    const d = date;
    const hours = `${d.getHours()}`.padStart(2, '0');
    const minutes = `${d.getMinutes()}`.padStart(2, '0');
    const seconds = '00';
    return `${hours}:${minutes}:${seconds}`;
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthdayDate(selectedDate);
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setReminderTime(selectedTime);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Se necesita acceso a la galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/birthdays/${id}`);
        const data = response.data;

        setName(data.name);
        setBirthdayDate(new Date(`${data.birthday_date}T00:00:00`));
        setRelationship(data.relationship || '');
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setNotes(data.notes || '');
        setReminder(data.reminder ?? false);
        setReminderTime(data.reminder_time ? new Date(`1970-01-01T${data.reminder_time}`) : null);
        setImageUri(data.photo || null);
      } catch (error: any) {
        console.log(error.response?.data || error.message);
        Alert.alert('Error', 'No se pudo cargar el cumpleaños');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    if (!name || !birthdayDate) {
      Alert.alert('Campos obligatorios', 'Nombre y fecha son requeridos');
      return;
    }

    try {
      await api.put(`/birthdays/${id}`, {
        name,
        birthday_date: formatDate(birthdayDate),
        relationship,
        phone,
        email,
        notes,
        reminder,
        reminder_time: reminder ? formatTime(reminderTime) : null,
        photo: imageUri,
      });

      Alert.alert('Actualizado', 'Cumpleaños actualizado correctamente');
      router.replace('/home');
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo actualizar');
    }
  };

  if (loading) {
    return <Text style={{ textAlign: 'center', marginTop: 50 }}>Cargando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>✏️ Editar Cumpleaños</Text>

      <TextInput style={styles.input} placeholder="Nombre" value={name} onChangeText={setName} />

      <TouchableOpacity style={[styles.input, styles.datePicker]} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: birthdayDate ? '#000' : '#888' }}>
          {birthdayDate ? formatDate(birthdayDate) : 'Selecciona fecha (YYYY-MM-DD)'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={birthdayDate || new Date()}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <TextInput style={styles.input} placeholder="Relación" value={relationship} onChangeText={setRelationship} />
      <TextInput style={styles.input} placeholder="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={[styles.input, { height: 80 }]} placeholder="Notas" value={notes} onChangeText={setNotes} multiline />

      <View style={styles.reminderContainer}>
        <Text style={styles.reminderLabel}>Recordatorio</Text>
        <Switch value={reminder} onValueChange={setReminder} thumbColor={reminder ? 'orange' : '#ccc'} />
      </View>

      {reminder && (
        <>
          <TouchableOpacity style={[styles.input, styles.datePicker]} onPress={() => setShowTimePicker(true)}>
            <Text style={{ color: reminderTime ? '#000' : '#888' }}>
              {reminderTime ? formatTime(reminderTime) : 'Selecciona hora (HH:mm:ss)'}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={reminderTime || new Date()}
              mode="time"
              display="default"
              onChange={onChangeTime}
              is24Hour={true}
            />
          )}
        </>
      )}

      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.buttonText}>📷 Cambiar Foto</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            marginVertical: 10,
            alignSelf: 'center',
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Actualizar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#EDE7F6', // lila claro
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#512DA8', // lila profundo
  },
  input: {
    borderWidth: 2,
    borderColor: '#7E57C2', // lila intermedio
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: '#F3E5F5', // lila muy claro
    justifyContent: 'center',
    color: '#333',
  },
  datePicker: {
    justifyContent: 'center',
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#512DA8', // lila profundo
  },
  imagePickerButton: {
    backgroundColor: '#7E57C2', // lila intermedio
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#512DA8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  button: {
    backgroundColor: '#512DA8', // lila profundo
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#512DA8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  cancelButtonText: {
    color: '#7E57C2', // lila intermedio
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});
