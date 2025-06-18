import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Package, Truck, CircleCheck as CheckCircle, Clock, MapPin, Phone, MessageCircle, FileText, TriangleAlert as AlertTriangle, RotateCcw } from 'lucide-react-native';
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

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

interface OrderDetails {
  id: string;
  status: 'Confirmed' | 'In Transit' | 'Delivered' | 'Cancelled';
  orderDate: string;
  estimatedDelivery: string;
  manufacturerName: string;
  fabricName: string;
  quantity: number;
  totalAmount: number;
  trackingNumber: string;
  deliveryAddress: string;
  trackingSteps: TrackingStep[];
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function OrderTrackingScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation values - start with 1 to prevent flashing
  const headerOpacity = useSharedValue(1);
  const statusOpacity = useSharedValue(1);
  const trackingOpacity = useSharedValue(1);
  const summaryOpacity = useSharedValue(1);
  const truckPosition = useSharedValue(0);

  // Mock data
  const mockOrderDetails: OrderDetails = {
    id: params.orderId as string || 'ORD-1042',
    status: 'In Transit',
    orderDate: '12 June 2025',
    estimatedDelivery: '15 June 2025',
    manufacturerName: 'Usman Cotton Mills',
    fabricName: 'Premium Cotton Fabric',
    quantity: 200,
    totalAmount: 46000,
    trackingNumber: 'TRK-789456',
    deliveryAddress: 'Shop #45, Anarkali Bazaar, Lahore',
    trackingSteps: [
      {
        id: 'step-1',
        title: 'Order Confirmed',
        description: 'Your order has been confirmed by the manufacturer',
        timestamp: '12 June 2025, 10:30 AM',
        completed: true,
        current: false,
      },
      {
        id: 'step-2',
        title: 'In Production',
        description: 'Fabric is being prepared and quality checked',
        timestamp: '12 June 2025, 2:15 PM',
        completed: true,
        current: false,
      },
      {
        id: 'step-3',
        title: 'Shipped',
        description: 'Order has been dispatched from the manufacturer',
        timestamp: '13 June 2025, 9:00 AM',
        completed: true,
        current: false,
      },
      {
        id: 'step-4',
        title: 'In Transit',
        description: 'Package is on the way to your location',
        timestamp: '14 June 2025, 11:30 AM',
        completed: true,
        current: true,
      },
      {
        id: 'step-5',
        title: 'Out for Delivery',
        description: 'Package is out for final delivery',
        timestamp: 'Expected: 15 June 2025',
        completed: false,
        current: false,
      },
      {
        id: 'step-6',
        title: 'Delivered',
        description: 'Package delivered successfully',
        timestamp: 'Expected: 15 June 2025',
        completed: false,
        current: false,
      },
    ],
  };

  useEffect(() => {
    if (!isLoaded) {
      setOrderDetails(mockOrderDetails);
      
      // Calculate truck position immediately
      const completedSteps = mockOrderDetails.trackingSteps.filter(step => step.completed).length;
      const progress = completedSteps / mockOrderDetails.trackingSteps.length;
      truckPosition.value = progress;
      
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Separate effect for animations that only runs once
  useEffect(() => {
    const startAnimations = () => {
      headerOpacity.value = withTiming(1, { duration: 300 });
      statusOpacity.value = withTiming(1, { duration: 300 });
      trackingOpacity.value = withTiming(1, { duration: 300 });
      summaryOpacity.value = withTiming(1, { duration: 300 });
      
      // Animate truck with spring for smooth movement
      const completedSteps = orderDetails?.trackingSteps.filter(step => step.completed).length || 0;
      const progress = completedSteps / (orderDetails?.trackingSteps.length || 1);
      truckPosition.value = withSpring(progress, { damping: 15, stiffness: 100 });
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

  const handleViewInvoice = () => {
    Alert.alert('View Invoice', 'Invoice viewer would open here');
  };

  const handleReportIssue = () => {
    Alert.alert('Report Issue', 'Issue reporting form would open here');
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Support contact options would appear here');
  };

  const handleExchangeReturn = () => {
    Alert.alert('Exchange/Return', 'Exchange and return process would start here');
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

  const statusAnimatedStyle = useAnimatedStyle(() => ({
    opacity: statusOpacity.value,
    transform: [
      {
        translateY: interpolate(statusOpacity.value, [0, 1], [20, 0]),
      },
    ],
  }));

  const trackingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: trackingOpacity.value,
  }));

  const summaryAnimatedStyle = useAnimatedStyle(() => ({
    opacity: summaryOpacity.value,
  }));

  const truckAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(truckPosition.value, [0, 1], [0, 280]),
      },
    ],
  }));

  const renderTrackingStep = (step: TrackingStep, index: number) => {
    return (
      <Animated.View
        key={step.id}
        entering={FadeIn.duration(300).delay(index * 100)}
        style={[
          styles.trackingStep,
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
          {index < orderDetails!.trackingSteps.length - 1 && (
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
  };

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
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Status */}
        <Animated.View style={[styles.statusSection, statusAnimatedStyle]}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
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
            
            <View style={styles.deliveryInfo}>
              <MapPin size={16} color="#666" />
              <Text style={styles.deliveryText}>
                Expected delivery: {orderDetails.estimatedDelivery}
              </Text>
            </View>
            
            <Text style={styles.trackingNumber}>
              Tracking: {orderDetails.trackingNumber}
            </Text>
          </View>
        </Animated.View>

        {/* Animated Progress */}
        <Animated.View style={[styles.progressSection, trackingAnimatedStyle]}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.truckIcon, truckAnimatedStyle]}>
              <Truck size={24} color="#D97706" />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Tracking Steps */}
        <View style={styles.trackingSection}>
          <Text style={styles.sectionTitle}>Tracking Details</Text>
          <View style={styles.trackingSteps}>
            {orderDetails.trackingSteps.map((step, index) => renderTrackingStep(step, index))}
          </View>
        </View>

        {/* Order Summary */}
        <Animated.View style={[styles.summarySection, summaryAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Manufacturer:</Text>
              <Text style={styles.summaryValue}>{orderDetails.manufacturerName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fabric:</Text>
              <Text style={styles.summaryValue}>{orderDetails.fabricName}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantity:</Text>
              <Text style={styles.summaryValue}>{orderDetails.quantity} meters</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount:</Text>
              <Text style={[styles.summaryValue, styles.totalAmount]}>
                {formatCurrency(orderDetails.totalAmount)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Address:</Text>
              <Text style={[styles.summaryValue, styles.addressText]}>
                {orderDetails.deliveryAddress}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View style={[styles.actionsSection, summaryAnimatedStyle]}>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleViewInvoice}
              activeOpacity={0.8}
            >
              <FileText size={20} color="#000" />
              <Text style={styles.actionButtonText}>View Invoice</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleReportIssue}
              activeOpacity={0.8}
            >
              <AlertTriangle size={20} color="#DC2626" />
              <Text style={[styles.actionButtonText, { color: '#DC2626' }]}>Report Issue</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleContactSupport}
              activeOpacity={0.8}
            >
              <Phone size={20} color="#059669" />
              <Text style={[styles.actionButtonText, { color: '#059669' }]}>Contact</Text>
            </TouchableOpacity>
            
            {orderDetails.status === 'Delivered' && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleExchangeReturn}
                activeOpacity={0.8}
              >
                <RotateCcw size={20} color="#3B82F6" />
                <Text style={[styles.actionButtonText, { color: '#3B82F6' }]}>Exchange</Text>
              </TouchableOpacity>
            )}
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
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  statusSection: {
    padding: 20,
  },
  statusCard: {
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
  statusHeader: {
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
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
    marginLeft: 8,
  },
  trackingNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    position: 'relative',
  },
  truckIcon: {
    position: 'absolute',
    top: -12,
    left: 0,
    width: 28,
    height: 28,
    backgroundColor: '#FFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#D97706',
  },
  trackingSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 16,
  },
  trackingSteps: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  trackingStep: {
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
  summarySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
    flex: 2,
    textAlign: 'right',
  },
  totalAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  addressText: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionsSection: {
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
});