import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, Building2, Star } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data - in a real app, this would come from an API
const MANUFACTURERS = [
  {
    id: '1',
    name: 'ABC Textiles',
    logo: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.8,
    location: 'Faisalabad',
    specialties: ['Cotton', 'Lawn', 'Denim'],
    topProducts: ['Premium Cotton', 'Summer Lawn', 'Stretch Denim'],
    minOrderValue: 50000,
  },
  {
    id: '2',
    name: 'XYZ Fabrics',
    logo: 'https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.5,
    location: 'Lahore',
    specialties: ['Silk', 'Chiffon', 'Georgette'],
    topProducts: ['Pure Silk', 'Printed Chiffon', 'Designer Georgette'],
    minOrderValue: 75000,
  },
  {
    id: '3',
    name: 'Modern Textiles',
    logo: 'https://images.pexels.com/photos/3862134/pexels-photo-3862134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    rating: 4.7,
    location: 'Karachi',
    specialties: ['Khaddar', 'Linen', 'Wool'],
    topProducts: ['Winter Khaddar', 'Pure Linen', 'Merino Wool'],
    minOrderValue: 60000,
  },
];

export default function ManufacturersScreen() {
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 600 });
    contentTranslateY.value = withDelay(200, withTiming(0, { duration: 600 }));
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handleBack = () => {
    router.back();
  };

  const handleManufacturerPress = (manufacturerId: string) => {
    router.push({
      pathname: '/manufacturer-profile',
      params: { id: manufacturerId }
    });
  };

  const renderManufacturer = ({ item }: { item: typeof MANUFACTURERS[0] }) => (
    <TouchableOpacity
      style={styles.manufacturerCard}
      onPress={() => handleManufacturerPress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.logo }} style={styles.logo} />
      <View style={styles.manufacturerInfo}>
        <View style={styles.manufacturerHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.rating}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={styles.location}>{item.location}</Text>
        
        <View style={styles.specialtiesContainer}>
          {item.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.sectionTitle}>Top Products:</Text>
          <Text style={styles.products}>{item.topProducts.join(' • ')}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.minOrder}>
            Min Order: PKR {item.minOrderValue.toLocaleString()}
          </Text>
          <ChevronRight size={20} color="#666" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Building2 size={24} color="#000" />
          <Text style={styles.title}>Manufacturers</Text>
        </View>
        <View style={styles.backButton} />
      </Animated.View>

      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <FlatList
          data={MANUFACTURERS}
          renderItem={renderManufacturer}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 20,
  },
  manufacturerCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  manufacturerInfo: {
    padding: 16,
  },
  manufacturerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  specialtyTag: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  productsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 4,
  },
  products: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  minOrder: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
}); 