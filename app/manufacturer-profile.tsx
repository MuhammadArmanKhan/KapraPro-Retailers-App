import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Building2, MapPin, Phone, Mail, Globe, Star, Package, DollarSign, Truck } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock data - in a real app, this would come from an API
const MANUFACTURER_DATA = {
  id: '1',
  name: 'ABC Textiles',
  logo: 'https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  description: 'Leading manufacturer of quality fabrics with over 20 years of experience in the textile industry.',
  rating: 4.8,
  totalOrders: 1500,
  location: 'Faisalabad',
  address: '123 Industrial Area, Faisalabad, Pakistan',
  phone: '+92 300 1234567',
  email: 'contact@abctextiles.com',
  website: 'www.abctextiles.com',
  establishedYear: '2000',
  employeeCount: '500+',
  certifications: ['ISO 9001:2015', 'ISO 14001:2015', 'OEKO-TEX®'],
  specialties: ['Cotton', 'Lawn', 'Denim'],
  products: [
    {
      id: '1',
      name: 'Premium Cotton',
      image: 'https://images.pexels.com/photos/4614227/pexels-photo-4614227.jpeg',
      price: 'PKR 500/meter',
      minOrder: '100 meters',
      description: 'High-quality cotton fabric suitable for all seasons.',
    },
    {
      id: '2',
      name: 'Summer Lawn',
      image: 'https://images.pexels.com/photos/4614226/pexels-photo-4614226.jpeg',
      price: 'PKR 400/meter',
      minOrder: '150 meters',
      description: 'Lightweight lawn fabric perfect for summer wear.',
    },
    {
      id: '3',
      name: 'Stretch Denim',
      image: 'https://images.pexels.com/photos/4614225/pexels-photo-4614225.jpeg',
      price: 'PKR 600/meter',
      minOrder: '80 meters',
      description: 'High-quality stretch denim for modern fashion.',
    },
  ],
  deliveryInfo: {
    minDeliveryTime: '3-5 days',
    shippingAreas: ['All Pakistan', 'International'],
    returnPolicy: '7 days return policy for quality issues',
  },
  paymentMethods: ['Bank Transfer', 'Cash on Delivery', 'Letter of Credit'],
};

export default function ManufacturerProfileScreen() {
  const { id } = useLocalSearchParams();
  const headerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  // In a real app, fetch manufacturer data based on id
  const [manufacturer] = useState(MANUFACTURER_DATA);

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

  const renderProduct = ({ item }: { item: typeof manufacturer.products[0] }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <View style={styles.productDetails}>
          <View style={styles.detailItem}>
            <DollarSign size={16} color="#666" />
            <Text style={styles.detailText}>{item.price}</Text>
          </View>
          <View style={styles.detailItem}>
            <Package size={16} color="#666" />
            <Text style={styles.detailText}>Min: {item.minOrder}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Manufacturer Profile</Text>
        <View style={styles.backButton} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: manufacturer.logo }} style={styles.logo} />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{manufacturer.name}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Text style={styles.rating}>{manufacturer.rating}</Text>
                <Text style={styles.orders}>({manufacturer.totalOrders} orders)</Text>
              </View>
              <Text style={styles.location}>{manufacturer.location}</Text>
            </View>
          </View>

          <Text style={styles.description}>{manufacturer.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <MapPin size={20} color="#666" />
                <Text style={styles.contactText}>{manufacturer.address}</Text>
              </View>
              <View style={styles.contactItem}>
                <Phone size={20} color="#666" />
                <Text style={styles.contactText}>{manufacturer.phone}</Text>
              </View>
              <View style={styles.contactItem}>
                <Mail size={20} color="#666" />
                <Text style={styles.contactText}>{manufacturer.email}</Text>
              </View>
              <View style={styles.contactItem}>
                <Globe size={20} color="#666" />
                <Text style={styles.contactText}>{manufacturer.website}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Products</Text>
            <FlatList
              data={manufacturer.products}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Truck size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Delivery Time</Text>
                  <Text style={styles.infoValue}>{manufacturer.deliveryInfo.minDeliveryTime}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <MapPin size={20} color="#666" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Shipping Areas</Text>
                  <Text style={styles.infoValue}>{manufacturer.deliveryInfo.shippingAreas.join(', ')}</Text>
                </View>
              </View>
              <Text style={styles.returnPolicy}>{manufacturer.deliveryInfo.returnPolicy}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <View style={styles.tagsContainer}>
              {manufacturer.paymentMethods.map((method, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{method}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.tagsContainer}>
              {manufacturer.certifications.map((cert, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{cert}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginLeft: 4,
  },
  orders: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 16,
  },
  contactInfo: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
    marginLeft: 12,
    flex: 1,
  },
  productsList: {
    paddingRight: 20,
  },
  productCard: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 12,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  returnPolicy: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  tag: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
}); 