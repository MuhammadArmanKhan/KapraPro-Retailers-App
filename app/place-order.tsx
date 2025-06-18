import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown, Plus, Minus, MapPin, Calendar, CreditCard, Package, Truck, CircleCheck as CheckCircle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

interface Manufacturer {
  id: string;
  name: string;
  location: string;
  rating: number;
  deliveryTime: string;
}

interface Fabric {
  id: string;
  name: string;
  category: string;
  pricePerMeter: number;
  minOrder: number;
  maxOrder: number;
  colors: string[];
  specifications: {
    weight: string;
    width: string;
    composition: string;
  };
}

interface OrderSummary {
  subtotal: number;
  tax: number;
  deliveryCharges: number;
  total: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function PlaceOrderScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [quantity, setQuantity] = useState(50);
  const [selectedColor, setSelectedColor] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(1);
  const formOpacity = useSharedValue(1);

  // Mock data
  const manufacturers: Manufacturer[] = [
    {
      id: 'mfg-001',
      name: 'Usman Cotton Mills',
      location: 'Faisalabad',
      rating: 4.8,
      deliveryTime: '5-7 days',
    },
    {
      id: 'mfg-002',
      name: 'Al-Karam Textiles',
      location: 'Karachi',
      rating: 4.9,
      deliveryTime: '7-10 days',
    },
    {
      id: 'mfg-003',
      name: 'Nishat Mills',
      location: 'Lahore',
      rating: 4.7,
      deliveryTime: '3-5 days',
    },
  ];

  const fabrics: Fabric[] = [
    {
      id: 'fab-001',
      name: 'Premium Cotton',
      category: 'Cotton',
      pricePerMeter: 230,
      minOrder: 50,
      maxOrder: 1000,
      colors: ['White', 'Cream', 'Light Blue', 'Light Pink'],
      specifications: {
        weight: '180 GSM',
        width: '58 inches',
        composition: '100% Cotton',
      },
    },
    {
      id: 'fab-002',
      name: 'Silk Blend Luxury',
      category: 'Silk',
      pricePerMeter: 450,
      minOrder: 25,
      maxOrder: 500,
      colors: ['Ivory', 'Gold', 'Rose', 'Lavender'],
      specifications: {
        weight: '120 GSM',
        width: '44 inches',
        composition: '70% Silk, 30% Cotton',
      },
    },
    {
      id: 'fab-003',
      name: 'Wash n Wear Classic',
      category: 'Wash n Wear',
      pricePerMeter: 180,
      minOrder: 100,
      maxOrder: 2000,
      colors: ['White', 'Sky Blue', 'Mint Green', 'Light Yellow'],
      specifications: {
        weight: '150 GSM',
        width: '58 inches',
        composition: '65% Polyester, 35% Cotton',
      },
    },
  ];

  useEffect(() => {
    // Initialize from params if available
    if (params.productName && params.manufacturer) {
      const manufacturer = manufacturers.find(m => m.name === params.manufacturer);
      const fabric = fabrics.find(f => f.name === params.productName);
      
      if (manufacturer) setSelectedManufacturer(manufacturer);
      if (fabric) {
        setSelectedFabric(fabric);
        setQuantity(fabric.minOrder);
        setSelectedColor(fabric.colors[0]);
      }
    }

    // Start animations
    headerOpacity.value = withTiming(1, { duration: 600 });
    formOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
  }, []);

  useEffect(() => {
    calculateOrderSummary();
  }, [selectedFabric, quantity]);

  const calculateOrderSummary = () => {
    if (!selectedFabric) return;

    const subtotal = selectedFabric.pricePerMeter * quantity;
    const tax = subtotal * 0.17; // 17% tax
    const deliveryCharges = subtotal > 50000 ? 0 : 2000; // Free delivery above 50k
    const total = subtotal + tax + deliveryCharges;

    setOrderSummary({
      subtotal,
      tax,
      deliveryCharges,
      total,
    });
  };

  const handleQuantityChange = (change: number) => {
    if (!selectedFabric) return;
    
    const newQuantity = quantity + change;
    if (newQuantity >= selectedFabric.minOrder && newQuantity <= selectedFabric.maxOrder) {
      setQuantity(newQuantity);
    }
  };

  const handlePreviewOrder = () => {
    if (!selectedManufacturer || !selectedFabric || !selectedColor || !deliveryAddress) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    // Navigate to preview screen with all necessary data
    router.push({
      pathname: '/order-preview',
      params: {
        manufacturerName: selectedManufacturer.name,
        deliveryTime: selectedManufacturer.deliveryTime,
        fabricName: selectedFabric.name,
        fabricWeight: selectedFabric.specifications.weight,
        fabricWidth: selectedFabric.specifications.width,
        fabricComposition: selectedFabric.specifications.composition,
        quantity: quantity.toString(),
        color: selectedColor,
        deliveryAddress,
        deliveryDate,
        specialInstructions,
        subtotal: orderSummary?.subtotal.toString(),
        tax: orderSummary?.tax.toString(),
        deliveryCharges: orderSummary?.deliveryCharges.toString(),
        total: orderSummary?.total.toString(),
      },
    });
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(headerOpacity.value, [0, 1], [20, 0]),
      },
    ],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
  }));

  const renderDropdown = (
    title: string,
    value: string,
    onPress: () => void,
    icon: React.ReactNode
  ) => (
    <TouchableOpacity style={styles.dropdown} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.dropdownContent}>
        <View style={styles.dropdownIcon}>{icon}</View>
        <View style={styles.dropdownText}>
          <Text style={styles.dropdownLabel}>{title}</Text>
          <Text style={styles.dropdownValue}>{value || `Select ${title}`}</Text>
        </View>
      </View>
      <ChevronDown size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Place New Order</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.form, formAnimatedStyle]}>
          {/* Manufacturer Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Manufacturer</Text>
            {renderDropdown(
              'Manufacturer',
              selectedManufacturer?.name || '',
              () => {
                // Show manufacturer selection modal
                Alert.alert('Select Manufacturer', 'Manufacturer selection modal would open here');
              },
              <Package size={20} color="#666" />
            )}
            {selectedManufacturer && (
              <View style={styles.manufacturerInfo}>
                <Text style={styles.infoText}>
                  📍 {selectedManufacturer.location} • ⭐ {selectedManufacturer.rating} • 🚚 {selectedManufacturer.deliveryTime}
                </Text>
              </View>
            )}
          </View>

          {/* Fabric Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Fabric</Text>
            {renderDropdown(
              'Fabric Type',
              selectedFabric?.name || '',
              () => {
                // Show fabric selection modal
                Alert.alert('Select Fabric', 'Fabric selection modal would open here');
              },
              <Package size={20} color="#666" />
            )}
            {selectedFabric && (
              <View style={styles.fabricInfo}>
                <Text style={styles.fabricSpecs}>
                  {selectedFabric.specifications.weight} • {selectedFabric.specifications.width} • {selectedFabric.specifications.composition}
                </Text>
                <Text style={styles.priceInfo}>
                  {formatCurrency(selectedFabric.pricePerMeter)}/meter (Min: {selectedFabric.minOrder}m, Max: {selectedFabric.maxOrder}m)
                </Text>
              </View>
            )}
          </View>

          {/* Color Selection */}
          {selectedFabric && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Color</Text>
              <View style={styles.colorOptions}>
                {selectedFabric.colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      selectedColor === color && styles.selectedColorOption,
                    ]}
                    onPress={() => setSelectedColor(color)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.colorText,
                        selectedColor === color && styles.selectedColorText,
                      ]}
                    >
                      {color}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Quantity Selection */}
          {selectedFabric && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quantity (Meters)</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    quantity <= selectedFabric.minOrder && styles.disabledButton,
                  ]}
                  onPress={() => handleQuantityChange(-10)}
                  disabled={quantity <= selectedFabric.minOrder}
                  activeOpacity={0.8}
                >
                  <Minus size={20} color={quantity <= selectedFabric.minOrder ? "#CCC" : "#000"} />
                </TouchableOpacity>
                
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityValue}>{quantity}</Text>
                  <Text style={styles.quantityUnit}>meters</Text>
                </View>
                
                <TouchableOpacity
                  style={[
                    styles.quantityButton,
                    quantity >= selectedFabric.maxOrder && styles.disabledButton,
                  ]}
                  onPress={() => handleQuantityChange(10)}
                  disabled={quantity >= selectedFabric.maxOrder}
                  activeOpacity={0.8}
                >
                  <Plus size={20} color={quantity >= selectedFabric.maxOrder ? "#CCC" : "#000"} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Delivery Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder="Delivery Address"
                placeholderTextColor="#999"
                value={deliveryAddress}
                onChangeText={setDeliveryAddress}
                multiline
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder="Preferred Delivery Date (Optional)"
                placeholderTextColor="#999"
                value={deliveryDate}
                onChangeText={setDeliveryDate}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Package size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder="Special Instructions (Optional)"
                placeholderTextColor="#999"
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                multiline
              />
            </View>
          </View>

          {/* Order Summary Preview */}
          {orderSummary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal ({quantity}m):</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(orderSummary.subtotal)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax (17%):</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(orderSummary.tax)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery:</Text>
                  <Text style={styles.summaryValue}>
                    {orderSummary.deliveryCharges === 0 ? 'FREE' : formatCurrency(orderSummary.deliveryCharges)}
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>{formatCurrency(orderSummary.total)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.previewButton,
                (!selectedManufacturer || !selectedFabric || !selectedColor || !deliveryAddress) && styles.disabledButton,
              ]}
              onPress={handlePreviewOrder}
              disabled={!selectedManufacturer || !selectedFabric || !selectedColor || !deliveryAddress}
              activeOpacity={0.8}
            >
              <Text style={styles.previewButtonText}>Preview Order</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
    textAlign: 'center',
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  dropdownContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    marginRight: 12,
  },
  dropdownText: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 2,
  },
  dropdownValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  manufacturerInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  fabricInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
  },
  fabricSpecs: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginBottom: 4,
  },
  priceInfo: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  colorOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    backgroundColor: '#000',
  },
  colorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  selectedColorText: {
    color: '#FFF',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#F0F0F0',
  },
  quantityDisplay: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  quantityValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  quantityUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: 12,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
    minHeight: 20,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  actionButtons: {
    marginTop: 20,
  },
  previewButton: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
});