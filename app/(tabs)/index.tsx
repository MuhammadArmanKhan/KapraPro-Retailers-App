import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Search, Plus, Package, CreditCard, TrendingUp, Truck, Clock, DollarSign } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useRouter } from 'expo-router';

interface DashboardData {
  pendingOrders: number;
  dueAmount: number;
  newOffers: Array<{ id: string; title: string; discount: string }>;
  todayDeliveries: number;
  recentOrders: Array<{ id: string; fabric: string; amount: string; status: string }>;
  totalOrders: number;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    pendingOrders: 3,
    dueAmount: 45000,
    newOffers: [
      { id: '1', title: '20% off on Wash n Wear', discount: '20%' },
      { id: '2', title: 'Cotton Fabric Special Deal', discount: '15%' },
    ],
    todayDeliveries: 2,
    recentOrders: [
      { id: '1', fabric: 'Premium Cotton', amount: 'PKR 12,500', status: 'Delivered' },
      { id: '2', fabric: 'Silk Blend', amount: 'PKR 8,900', status: 'In Transit' },
      { id: '3', fabric: 'Lawn Fabric', amount: 'PKR 15,200', status: 'Processing' },
    ],
    totalOrders: 156,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation values
  const headerOpacity = useSharedValue(1);
  const searchBarTranslateY = useSharedValue(0);
  const cardsOpacity = useSharedValue(1);
  const cardsTranslateY = useSharedValue(0);
  const fabScale = useSharedValue(1);
  const fabRotation = useSharedValue(0);

  useEffect(() => {
    if (!isLoaded) {
      // Load data immediately
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Separate effect for animations that only runs once
  useEffect(() => {
    const startAnimations = () => {
      headerOpacity.value = withTiming(1, { duration: 300 });
      searchBarTranslateY.value = withTiming(0, { duration: 300 });
      cardsOpacity.value = withTiming(1, { duration: 300 });
      cardsTranslateY.value = withTiming(0, { duration: 300 });
      fabScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      fabRotation.value = withSpring(360, { damping: 10, stiffness: 80 });
    };

    startAnimations();
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: searchBarTranslateY.value }],
    opacity: interpolate(searchBarTranslateY.value, [30, 0], [0, 1]),
  }));

  const cardsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
    transform: [{ translateY: cardsTranslateY.value }],
  }));

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: fabScale.value },
      { rotate: `${fabRotation.value}deg` },
    ],
  }));

  const handleCardPress = (cardType: string) => {
    // Add subtle scale animation on press
    console.log(`Navigate to ${cardType}`);
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const handleNotifications = () => {
    router.push('/notifications');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LanguageSwitcher />
      
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <View style={styles.headerLeft}>
          <Text style={styles.shopName}>{user?.shopName || 'Khan Cloth House'}</Text>
          <Text style={styles.marketName}>{user?.market || 'Anarkali Bazaar'}</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={handleNotifications}
        >
          <Bell size={24} color="#000" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Search Bar */}
        <Animated.View style={[styles.searchContainer, searchBarAnimatedStyle]}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search fabrics, manufacturers..."
              placeholderTextColor="#999"
            />
          </View>
        </Animated.View>

        {/* Dashboard Cards */}
        <Animated.View style={[styles.cardsContainer, cardsAnimatedStyle]}>
          {/* Row 1 */}
          <View style={styles.cardRow}>
            <TouchableOpacity 
              style={[styles.card, styles.cardHalf]} 
              onPress={() => handleCardPress('PendingOrders')}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#FFF3CD' }]}>
                <Clock size={24} color="#856404" />
              </View>
              <Text style={styles.cardValue}>{dashboardData.pendingOrders}</Text>
              <Text style={styles.cardLabel}>Pending Orders</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, styles.cardHalf]} 
              onPress={() => handleCardPress('OutstandingCredit')}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#F8D7DA' }]}>
                <CreditCard size={24} color="#721C24" />
              </View>
              <Text style={styles.cardValue}>{formatCurrency(dashboardData.dueAmount)}</Text>
              <Text style={styles.cardLabel}>Outstanding Credit</Text>
            </TouchableOpacity>
          </View>

          {/* Row 2 */}
          <View style={styles.cardRow}>
            <TouchableOpacity 
              style={[styles.card, styles.cardHalf]} 
              onPress={() => handleCardPress('TodayDeliveries')}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#D4EDDA' }]}>
                <Truck size={24} color="#155724" />
              </View>
              <Text style={styles.cardValue}>{dashboardData.todayDeliveries}</Text>
              <Text style={styles.cardLabel}>Deliveries Today</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, styles.cardHalf]} 
              onPress={() => handleCardPress('TotalOrders')}
              activeOpacity={0.8}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#D1ECF1' }]}>
                <Package size={24} color="#0C5460" />
              </View>
              <Text style={styles.cardValue}>{dashboardData.totalOrders}</Text>
              <Text style={styles.cardLabel}>Total Orders</Text>
            </TouchableOpacity>
          </View>

          {/* New Offers Card */}
          <TouchableOpacity 
            style={[styles.card, styles.cardFull]} 
            onPress={() => handleCardPress('NewOffers')}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.cardIcon, { backgroundColor: '#E2E3FF' }]}>
                <TrendingUp size={24} color="#4338CA" />
              </View>
              <Text style={styles.cardTitle}>New Offers</Text>
            </View>
            <View style={styles.offersContainer}>
              {dashboardData.newOffers.map((offer) => (
                <View key={offer.id} style={styles.offerItem}>
                  <Text style={styles.offerText}>{offer.title}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{offer.discount}</Text>
                  </View>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Recent Orders */}
        <Animated.View style={[styles.section, cardsAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.ordersContainer}>
              {dashboardData.recentOrders.map((order) => (
                <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.8}>
                  <Text style={styles.orderFabric}>{order.fabric}</Text>
                  <Text style={styles.orderAmount}>{order.amount}</Text>
                  <View style={[
                    styles.statusBadge,
                    order.status === 'Delivered' && styles.statusDelivered,
                    order.status === 'In Transit' && styles.statusInTransit,
                    order.status === 'Processing' && styles.statusProcessing,
                  ]}>
                    <Text style={[
                      styles.statusText,
                      order.status === 'Delivered' && styles.statusTextDelivered,
                      order.status === 'In Transit' && styles.statusTextInTransit,
                      order.status === 'Processing' && styles.statusTextProcessing,
                    ]}>
                      {order.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </ScrollView>

      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, fabAnimatedStyle]}>
        <TouchableOpacity 
          style={styles.fabButton} 
          onPress={() => handleCardPress('PostOrder')}
          activeOpacity={0.8}
        >
          <Plus size={28} color="#FFF" />
        </TouchableOpacity>
      </Animated.View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flex: 1,
  },
  shopName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  marketName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  card: {
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
  cardHalf: {
    flex: 1,
  },
  cardFull: {
    marginBottom: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginLeft: 12,
  },
  offersContainer: {
    gap: 12,
  },
  offerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#000',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFF',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 16,
  },
  ordersContainer: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 20,
  },
  orderCard: {
    width: 200,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  orderFabric: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 8,
  },
  orderAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusDelivered: {
    backgroundColor: '#D4EDDA',
  },
  statusInTransit: {
    backgroundColor: '#FFF3CD',
  },
  statusProcessing: {
    backgroundColor: '#D1ECF1',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  statusTextDelivered: {
    color: '#155724',
  },
  statusTextInTransit: {
    color: '#856404',
  },
  statusTextProcessing: {
    color: '#0C5460',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});