import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface GiftStore {
  id: string;
  name: string;
  description: string;
  image: string; // URL o recurso local
  url: string;
}

// Datos de ejemplo, puedes reemplazar con datos reales o API
const giftStores: GiftStore[] = [
  {
    id: '1',
    name: 'PLAYLAND',
    description: 'Piscina Juegos acuáticos Juegos mecánicos Toboganes Patio de comida Área de cumpleañeros ',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThbezyz9jjbnXC7CAkfRE9W7aU8skImsLoJw&s',
    url: 'https://www.facebook.com/PlayLandSantaCruz/?locale=es_LA',
  },
  {
    id: '2',
    name: 'LA CASA DEL CAMBA',
    description: 'Todo en un solo lugar! Cultura, tradición, parque de niños, áreas verdes, lagunas',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScsm8DALJTCQ3woYavLxB_630kTx7Zvl4rYQ&s',
    url: 'https://www.facebook.com/CasaDelCamba/?locale=es_LA',
  },
  {
    id: '3',
    name: 'CHOCOLATES EL CEIBO',
    description: 'Descubre la esencia de nuestros productos, elaborados con ingredientes naturales y recetas tradicionales.',
    image: 'https://pbs.twimg.com/profile_images/920680517271539714/uHvOzKQE_400x400.jpg',
    url: 'https://www.elceibo.com/',
  },
];

// Logos de tiendas rápidas con URL y logo local o remoto
const quickStores = [
  { name: 'Amazon', url: 'https://www.amazon.com', logo: require('../assets/images/amazon.png') },
  { name: 'Etsy', url: 'https://www.etsy.com', logo: require('../assets/images/etsy.png') },
  { name: 'eBay', url: 'https://www.ebay.com', logo: require('../assets/images/ebay.png') },
  { name: 'Gucci', url: 'https://www.gucci.com', logo: require('../assets/images/gucci.png') },
  { name: 'Ésika', url: 'https://www.esika.com', logo: require('../assets/images/esika.jpg') },
  { name: 'Avon', url: 'https://www.avon.com', logo: require('../assets/images/avon.png') },
  { name: 'Bata', url: 'https://www.bata.com', logo: require('../assets/images/bata.png') },
  { name: 'KFC', url: 'https://www.kfc.com', logo: require('../assets/images/kfc.png') },
  { name: 'Starbucks', url: 'https://www.starbucks.com', logo: require('../assets/images/starbucks.png') },
];

export default function GiftsShow() {
  const router = useRouter();

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("No se puede abrir el link: " + url);
    }
  };

  const renderItem = ({ item }: { item: GiftStore }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => openLink(item.url)}
        >
          <Text style={styles.buttonText}>Visitar tienda</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tiendas de Regalos</Text>

      <FlatList
        data={giftStores}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footerLinks}>
        <Text style={styles.footerTitle}>Tiendas rápidas:</Text>
        <View style={styles.logosContainer}>
          {quickStores.map(({ name, url, logo }) => (
            <TouchableOpacity
              key={name}
              onPress={() => openLink(url)}
              style={styles.logoWrapper}
            >
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE7F6',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#512DA8',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F3E5F5',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#512DA8',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A148C',
  },
  description: {
    color: '#7E57C2',
    marginVertical: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#512DA8',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  footerLinks: {
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: '#D1C4E9',
    paddingTop: 15,
  },
  footerTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#512DA8',
    marginBottom: 10,
    textAlign: 'center',
  },
  logosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  logoWrapper: {
    margin: 8,
    width: 40,
    height: 40,
    marginBottom: 50,
  },
  logo: {
    width: '130%',
    height: '130%',
  },
});
