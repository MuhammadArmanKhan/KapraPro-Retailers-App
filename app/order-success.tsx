import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleCheck as CheckCircle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';
import { AnimatedButton } from '@/components/AnimatedButton';

export default function OrderSuccessScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10, stiffness: 100 });
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleViewOrder = () => {
    router.push({
      pathname: '/order-details',
      params: { orderId: params.orderId },
    });
  };

  const handleGoToOrders = () => {
    router.replace('/(tabs)/orders');
  };

  const formatCurrency = (amount: string) => {
    return `PKR ${parseInt(amount, 10).toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={styles.content}
        entering={FadeIn.duration(500)}
      >
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <CheckCircle size={64} color="#10B981" />
        </Animated.View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.orderId}>Order ID: {params.orderId}</Text>

        <View style={styles.details}>
          <Text style={styles.detailText}>
            Your order for {params.fabricName} from {params.manufacturerName} has been confirmed.
          </Text>
          <Text style={styles.amount}>
            {formatCurrency(params.total as string)}
          </Text>
        </View>

        <Text style={styles.message}>
          You will receive updates about your order status. Thank you for your business!
        </Text>

        <View style={styles.actions}>
          <AnimatedButton
            title="View Order Details"
            onPress={handleViewOrder}
            variant="solid"
            style={styles.primaryButton}
          />
          <AnimatedButton
            title="Go to Orders"
            onPress={handleGoToOrders}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  orderId: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginBottom: 32,
  },
  details: {
    alignItems: 'center',
    marginBottom: 24,
  },
  detailText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  amount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  message: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
  },
}); 