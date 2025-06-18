import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Package, Truck, Calendar, CreditCard, MapPin, CircleCheck as CheckCircle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedButton } from '@/components/AnimatedButton';

interface OrderPreview {
  manufacturer: {
    name: string;
    deliveryTime: string;
  };
  fabric: {
    name: string;
    specifications: {
      weight: string;
      width: string;
      composition: string;
    };
  };
  quantity: number;
  color: string;
  deliveryAddress: string;
  deliveryDate: string;
  specialInstructions?: string;
  summary: {
    subtotal: number;
    tax: number;
    deliveryCharges: number;
    total: number;
  };
}

export default function OrderPreviewScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const [orderData, setOrderData] = useState<OrderPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation values
  const contentOpacity = useSharedValue(1);

  useEffect(() => {
    if (!isLoaded) {
      // In a real app, we would parse the params or fetch from API
      // For now, we'll use the params directly
      setOrderData({
        manufacturer: {
          name: params.manufacturerName as string,
          deliveryTime: params.deliveryTime as string,
        },
        fabric: {
          name: params.fabricName as string,
          specifications: {
            weight: params.fabricWeight as string,
            width: params.fabricWidth as string,
            composition: params.fabricComposition as string,
          },
        },
        quantity: parseInt(params.quantity as string, 10),
        color: params.color as string,
        deliveryAddress: params.deliveryAddress as string,
        deliveryDate: params.deliveryDate as string,
        specialInstructions: params.specialInstructions as string,
        summary: {
          subtotal: parseFloat(params.subtotal as string),
          tax: parseFloat(params.tax as string),
          deliveryCharges: parseFloat(params.deliveryCharges as string),
          total: parseFloat(params.total as string),
        },
      });
      setIsLoaded(true);
    }
  }, [isLoaded, params]);

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to place order
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to order success screen
      router.push({
        pathname: '/order-success',
        params: {
          orderId: `ORD-${Date.now()}`,
          manufacturerName: orderData?.manufacturer.name,
          fabricName: orderData?.fabric.name,
          total: orderData?.summary.total.toString(),
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  if (!orderData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Preview</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(300)}>
          {/* Manufacturer Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Manufacturer</Text>
            <View style={styles.detailRow}>
              <Package size={20} color="#666" />
              <Text style={styles.detailText}>{orderData.manufacturer.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Truck size={20} color="#666" />
              <Text style={styles.detailText}>Delivery in {orderData.manufacturer.deliveryTime}</Text>
            </View>
          </View>

          {/* Order Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Details</Text>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Fabric</Text>
              <Text style={styles.detailValue}>{orderData.fabric.name}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Quantity</Text>
              <Text style={styles.detailValue}>{orderData.quantity} meters</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Color</Text>
              <Text style={styles.detailValue}>{orderData.color}</Text>
            </View>
          </View>

          {/* Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Weight</Text>
              <Text style={styles.detailValue}>{orderData.fabric.specifications.weight}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Width</Text>
              <Text style={styles.detailValue}>{orderData.fabric.specifications.width}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Composition</Text>
              <Text style={styles.detailValue}>{orderData.fabric.specifications.composition}</Text>
            </View>
          </View>

          {/* Delivery Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <View style={styles.detailRow}>
              <MapPin size={20} color="#666" />
              <Text style={styles.detailText}>{orderData.deliveryAddress}</Text>
            </View>
            <View style={styles.detailRow}>
              <Calendar size={20} color="#666" />
              <Text style={styles.detailText}>{orderData.deliveryDate}</Text>
            </View>
          </View>

          {orderData.specialInstructions && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Special Instructions</Text>
              <Text style={styles.instructionsText}>{orderData.specialInstructions}</Text>
            </View>
          )}

          {/* Order Summary */}
          <View style={[styles.section, styles.summarySection]}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(orderData.summary.subtotal)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tax (17%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(orderData.summary.tax)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Delivery Charges</Text>
              <Text style={styles.summaryValue}>{formatCurrency(orderData.summary.deliveryCharges)}</Text>
            </View>
            <View style={[styles.summaryItem, styles.totalItem]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatCurrency(orderData.summary.total)}</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <AnimatedButton
          title="Confirm Order"
          onPress={handleConfirmOrder}
          loading={isLoading}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Medium',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    marginLeft: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  instructionsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 24,
  },
  summarySection: {
    backgroundColor: '#FAFAFA',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  totalItem: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  bottomAction: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
}); 