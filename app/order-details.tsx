import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Package, Truck, CircleCheck as CheckCircle, Clock, MapPin, Phone, MessageCircle, Download, Share, CreditCard, Calendar } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderItem {
  id: string;
  fabricName: string;
  category: string;
  quantity: number;
  rate: number;
  total: number;
  specifications: {
    weight: string;
    width: string;
    composition: string;
  };
}

interface DeliveryTimeline {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

interface OrderDetails {
  id: string;
  orderDate: string;
  status: 'Confirmed' | 'In Transit' | 'Delivered' | 'Cancelled';
  manufacturerName: string;
  manufacturerContact: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  estimatedDelivery: string;
  timeline: DeliveryTimeline[];
  invoiceNumber?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function OrderDetailsScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation values - start with 1 to prevent flashing
  const headerOpacity = useSharedValue(1);
  const contentOpacity = useSharedValue(1);
  const timelineOpacity = useSharedValue(1);

  // Mock data
  const mockOrderDetails: OrderDetails = {
    id: params.orderId as string || 'ORD-1042',
    orderDate: '12 June 2025',
    status: 'In Transit',
    manufacturerName: 'Usman Cotton Mills',
    manufacturerContact: '+92 300 1234567',
    items: [
      {
        id: 'item-1',
        fabricName: 'Premium Cotton Fabric',
        category: 'Cotton',
        quantity: 150,
        rate: 230,
        total: 34500,
        specifications: {
          weight: '180 GSM',
          width: '58 inches',
          composition: '100% Cotton',
        },
      },
      {
        id: 'item-2',
        fabricName: 'Cotton Blend',
        category: 'Cotton',
        quantity: 50,
        rate: 200,
        total: 10000,
        specifications: {
          weight: '160 GSM',
          width: '58 inches',
          composition: '80% Cotton, 20% Polyester',
        },
      },
    ],
    subtotal: 44500,
    tax: 7565, // 17% tax
    deliveryCharges: 1500,
    total: 53565,
    paymentMethod: 'Credit - 30 Days',
    deliveryAddress: 'Shop #45, Anarkali Bazaar, Lahore',
    estimatedDelivery: '15 June 2025',
    timeline: [
      {
        id: 'step-1',
        title: 'Order Confirmed',
        description: 'Order confirmed by manufacturer',
        timestamp: '12 June 2025, 10:30 AM',
        completed: true,
        current: false,
      },
      {
        id: 'step-2',
        title: 'In Production',
        description: 'Fabric preparation in progress',
        timestamp: '12 June 2025, 2:15 PM',
        completed: true,
        current: false,
      },
      {
        id: 'step-3',
        title: 'Shipped',
        description: 'Order dispatched from facility',
        timestamp: '13 June 2025, 9:00 AM',
        completed: true,
        current: false,
      },
      {
        id: 'step-4',
        title: 'In Transit',
        description: 'Package on the way',
        timestamp: '14 June 2025, 11:30 AM',
        completed: true,
        current: true,
      },
      {
        id: 'step-5',
        title: 'Out for Delivery',
        description: 'Final delivery in progress',
        timestamp: 'Expected: 15 June 2025',
        completed: false,
        current: false,
      },
    ],
    invoiceNumber: 'INV-2025-1042',
  };

  useEffect(() => {
    if (!isLoaded) {
      setOrderDetails(mockOrderDetails);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Separate effect for animations that only runs once
  useEffect(() => {
    const startAnimations = () => {
      headerOpacity.value = withTiming(1, { duration: 300 });
      contentOpacity.value = withTiming(1, { duration: 300 });
      timelineOpacity.value = withTiming(1, { duration: 300 });
    };

    startAnimations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return { backgroundColor: '#EFF6FF', color: '#3B82F6' };
      case 'In Transit':
        return { backgroundColor: '#FFFBEB', color: '#D97706' };
      case 'Delivered':
        return { backgroundColor: '#ECFDF5', color: '#059669' };
      case 'Cancelled':
        return { backgroundColor: '#FEF2F2', color: '#DC2626' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const handleContactManufacturer = () => {
    Alert.alert('Contact Manufacturer', 'Contact options would appear here');
  };

  const handleDownloadInvoice = () => {
    Alert.alert('Download Invoice', 'Invoice download would start here');
  };

  const handleShareOrder = () => {
    Alert.alert('Share Order', 'Share options would appear here');
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

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const timelineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: timelineOpacity.value,
  }));

  const renderOrderItem = (item: OrderItem, index: number) => (
    <Animated.View
      key={item.id}
      style={[
        styles.itemCard,
        {
          opacity: contentOpacity.value,
          transform: [
            {
              translateY: interpolate(
                contentOpacity.value,
                [0, 1],
                [30 + index * 10, 0]
              ),
            },
          ],
        },
      ]}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.fabricName}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      
      <View style={styles.itemSpecs}>
        <Text style={styles.specsText}>
          {item.specifications.weight} • {item.specifications.width} • {item.specifications.composition}
        </Text>
      </View>
      
      <View style={styles.itemPricing}>
        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>Quantity:</Text>
          <Text style={styles.pricingValue}>{item.quantity} meters</Text>
        </View>
        <View style={styles.pricingRow}>
          <Text style={styles.pricingLabel}>Rate:</Text>
          <Text style={styles.pricingValue}>{formatCurrency(item.rate)}/meter</Text>
        </View>
        <View style={[styles.pricingRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>{formatCurrency(item.total)}</Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderTimelineStep = (step: DeliveryTimeline, index: number) => (
    <Animated.View
      key={step.id}
      entering={FadeIn.duration(300).delay(index * 100)}
      style={[
        styles.timelineStep,
        step.current && styles.currentStep,
      ]}
    >
      <View style={styles.stepIndicator}>
        <View style={[
          styles.stepCircle,
          step.completed && styles.completedStep,
          step.current && styles.currentStep,
        ]}>
          {step.completed ? (
            <CheckCircle size={16} color="#FFF" />
          ) : step.current ? (
            <Clock size={16} color="#FFF" />
          ) : (
            <View style={styles.pendingDot} />
          )}
        </View>
        {index < orderDetails!.timeline.length - 1 && (
          <View style={[
            styles.stepLine,
            step.completed && styles.completedLine,
          ]} />
        )}
      </View>
      
      <View style={styles.stepContent}>
        <Text style={[
          styles.stepTitle,
          step.current && styles.currentStepTitle,
        ]}>
          {step.title}
        </Text>
        <Text style={styles.stepDescription}>{step.description}</Text>
        <Text style={styles.stepTimestamp}>{step.timestamp}</Text>
      </View>
    </Animated.View>
  );

  if (!orderDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusColor(orderDetails.status);

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
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleShareOrder}
          activeOpacity={0.8}
        >
          <Share size={24} color="#000" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary */}
        <Animated.View style={[styles.summarySection, contentAnimatedStyle]}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.orderId}>{orderDetails.id}</Text>
                <Text style={styles.orderDate}>{orderDetails.orderDate}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                <Text style={[styles.statusText, { color: statusStyle.color }]}>
                  {orderDetails.status}
                </Text>
              </View>
            </View>
            
            <View style={styles.manufacturerInfo}>
              <Text style={styles.manufacturerName}>{orderDetails.manufacturerName}</Text>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={handleContactManufacturer}
                activeOpacity={0.8}
              >
                <Phone size={16} color="#000" />
                <Text style={styles.contactText}>Contact</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.deliveryInfo}>
              <MapPin size={16} color="#666" />
              <Text style={styles.deliveryText}>
                Delivery to: {orderDetails.deliveryAddress}
              </Text>
            </View>
            
            <View style={styles.deliveryInfo}>
              <Calendar size={16} color="#666" />
              <Text style={styles.deliveryText}>
                Expected: {orderDetails.estimatedDelivery}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Order Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {orderDetails.items.map((item, index) => renderOrderItem(item, index))}
        </View>

        {/* Payment & Billing */}
        <Animated.View style={[styles.billingSection, contentAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Payment & Billing</Text>
          <View style={styles.billingCard}>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Subtotal:</Text>
              <Text style={styles.billingValue}>{formatCurrency(orderDetails.subtotal)}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Tax (17%):</Text>
              <Text style={styles.billingValue}>{formatCurrency(orderDetails.tax)}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Delivery:</Text>
              <Text style={styles.billingValue}>
                {orderDetails.deliveryCharges === 0 ? 'FREE' : formatCurrency(orderDetails.deliveryCharges)}
              </Text>
            </View>
            <View style={[styles.billingRow, styles.totalBillingRow]}>
              <Text style={styles.totalBillingLabel}>Total:</Text>
              <Text style={styles.totalBillingValue}>{formatCurrency(orderDetails.total)}</Text>
            </View>
            
            <View style={styles.paymentMethod}>
              <CreditCard size={16} color="#666" />
              <Text style={styles.paymentText}>Payment: {orderDetails.paymentMethod}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Delivery Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Delivery Timeline</Text>
          <View style={styles.timelineCard}>
            {orderDetails.timeline.map((step, index) => renderTimelineStep(step, index))}
          </View>
        </View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionsSection, contentAnimatedStyle]}>
          {orderDetails.invoiceNumber && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDownloadInvoice}
              activeOpacity={0.8}
            >
              <Download size={20} color="#000" />
              <Text style={styles.actionButtonText}>Download Invoice</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push({
              pathname: '/order-tracking',
              params: { orderId: orderDetails.id },
            })}
            activeOpacity={0.8}
          >
            <Truck size={20} color="#000" />
            <Text style={styles.actionButtonText}>Track Order</Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
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
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  summarySection: {
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  manufacturerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  manufacturerName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    flex: 1,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  itemsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemHeader: {
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  itemSpecs: {
    marginBottom: 12,
  },
  specsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  itemPricing: {
    gap: 4,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  pricingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  billingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  billingCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billingLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  billingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  totalBillingRow: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  totalBillingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  totalBillingValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 12,
    borderRadius: 8,
  },
  paymentText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginLeft: 8,
  },
  timelineSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timelineCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  timelineStep: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  completedStep: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  currentStep: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CCC',
  },
  stepLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E5E5E5',
    marginTop: 8,
  },
  completedLine: {
    backgroundColor: '#059669',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 4,
  },
  currentStepTitle: {
    color: '#D97706',
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  stepTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  actionsSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
});