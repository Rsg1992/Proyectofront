import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import api from '../../api/api';

interface Birthday {
  id: number;
  name: string;
  birthday_date: string; // formato: YYYY-MM-DD
  relationship?: string;
}

// Configura el calendario en español
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
  ],
  dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

// ... (mismo import y configuración previa)

export default function BirthdayCalendar() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState({});
  const [filteredMonth, setFilteredMonth] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    try {
      const res = await api.get('/birthdays');
      const data = res.data;
      setBirthdays(data);

      const currentYear = new Date().getFullYear();
      const marks: any = {};

      data.forEach((b: Birthday) => {
        const [birthYear, birthMonth, birthDay] = b.birthday_date.split('-');
        const adjustedDate = `${currentYear}-${birthMonth}-${birthDay}`;
        marks[adjustedDate] = {
          marked: true,
          dotColor: '#7E57C2',
        };
      });

      setMarkedDates(marks);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar los cumpleaños');
    }
  };

  const birthdaysOnSelectedDate = birthdays.filter((b) => {
    if (!selectedDate) return false;
    const [, selectedMonth, selectedDay] = selectedDate.split('-');
    const [, bMonth, bDay] = b.birthday_date.split('-');
    return selectedMonth === bMonth && selectedDay === bDay;
  });

  const birthdaysInFilteredMonth = filteredMonth
    ? birthdays.filter((b) => {
        const [, month] = b.birthday_date.split('-');
        return parseInt(month) === filteredMonth;
      })
    : [];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>📅 Calendario de Cumpleaños</Text>

      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              selected: true,
              selectedColor: '#9575CD',
              marked: true,
              dotColor: '#fff',
            },
          }),
        }}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        style={styles.calendar}
      />

      {selectedDate && (
        <View style={styles.resultBox}>
          <Text style={styles.subtitle}>🎂 Cumpleaños el {selectedDate}:</Text>
          {birthdaysOnSelectedDate.length > 0 ? (
            birthdaysOnSelectedDate.map((b) => (
              <Text key={b.id} style={styles.textItem}>
                • {b.name} {b.relationship ? `(${b.relationship})` : ''}
              </Text>
            ))
          ) : (
            <Text style={[styles.textItem, { fontStyle: 'italic' }]}>
              No hay cumpleaños este día
            </Text>
          )}
        </View>
      )}

      <Text style={styles.subtitle}>🔍 Filtrar por mes:</Text>
      <View style={styles.months}>
        {Array.from({ length: 12 }).map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.monthButton,
              filteredMonth === i + 1 && styles.monthButtonSelected,
            ]}
            onPress={() => setFilteredMonth(filteredMonth === i + 1 ? null : i + 1)}
          >
            <Text
              style={{
                color: filteredMonth === i + 1 ? '#fff' : '#512DA8',
                fontFamily: 'sans-serif-medium',
              }}
            >
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredMonth && (
        <View style={styles.resultBox}>
          <Text style={styles.subtitle}>🎉 Cumpleaños en el mes {filteredMonth}:</Text>
          {birthdaysInFilteredMonth.length > 0 ? (
            birthdaysInFilteredMonth.map((item) => (
              <Text key={item.id} style={styles.textItem}>
                • {item.name} - {item.birthday_date}
              </Text>
            ))
          ) : (
            <Text style={[styles.textItem, { fontStyle: 'italic' }]}>
              No hay cumpleaños este mes
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

// ... (mismos estilos)


const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: '#F3E5F5',
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 30, // <-- Añade un margen superior
    color: '#512DA8',
    marginBottom: 20,
    fontFamily: 'sans-serif-medium',
  },
  calendar: {
    borderRadius: 10,
    elevation: 4,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    color: '#512DA8',
    fontFamily: 'sans-serif-medium',
  },
  textItem: {
    fontSize: 14,
    fontFamily: 'sans-serif',
    color: '#333',
    marginTop: 4,
  },
  months: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  monthButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#9575CD',
    borderRadius: 8,
    minWidth: 40,
    alignItems: 'center',
  },
  monthButtonSelected: {
    backgroundColor: '#9575CD',
  },
  resultBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#EDE7F6',
    borderRadius: 8,
  },
});
