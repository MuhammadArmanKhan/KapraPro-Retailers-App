import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, ChevronDown, ChevronUp, Package, Truck, CircleCheck as CheckCircle, Circle as XCircle, Clock, RotateCcw, Eye } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  interpolate,
  runOnJS,
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/LanguageContext';

interface Order {
  id: string;
  status: 'Confirmed' | 'In Transit' | 'Delivered' | 'Cancelled' | 'Processing';
  manufacturerName: string;
  manufacturerLogo?: string;
  fabricName: string;
  orderDate: string;
  quantity: number;
  pricePerMeter: number;
  totalAmount: number;
  invoiceNumber?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function OrdersScreen() {
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'ongoing' | 'past'>('ongoing');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animation values
  const tabIndicatorPosition = useSharedValue(0);
  const searchBarOpacity = useSharedValue(1);
  const ordersOpacity = useSharedValue(1);

  // Mock data
  const mockOrders: Order[] = [
    {
      id: 'ORD-1042',
      status: 'In Transit',
      manufacturerName: 'Usman Cotton Mills',
      fabricName: 'Wash n Wear Premium',
      orderDate: '12 June 2025',
      quantity: 200,
      pricePerMeter: 230,
      totalAmount: 46000,
      trackingNumber: 'TRK-789456',
      estimatedDelivery: '15 June 2025',
    },
    {
      id: 'ORD-1041',
      status: 'Confirmed',
      manufacturerName: 'Al-Karam Textiles',
      fabricName: 'Cotton Lawn Printed',
      orderDate: '10 June 2025',
      quantity: 150,
      pricePerMeter: 180,
      totalAmount: 27000,
      estimatedDelivery: '18 June 2025',
    },
    {
      id: 'ORD-1040',
      status: 'Processing',
      manufacturerName: 'Nishat Mills',
      fabricName: 'Silk Blend Fabric',
      orderDate: '8 June 2025',
      quantity: 100,
      pricePerMeter: 450,
      totalAmount: 45000,
      estimatedDelivery: '20 June 2025',
    },
    {
      id: 'ORD-1039',
      status: 'Delivered',
      manufacturerName: 'Gul Ahmed',
      fabricName: 'Premium Cotton',
      orderDate: '5 June 2025',
      quantity: 300,
      pricePerMeter: 200,
      totalAmount: 60000,
      invoiceNumber: 'INV-2025-001',
    },
    {
      id: 'ORD-1038',
      status: 'Delivered',
      manufacturerName: 'Crescent Textiles',
      fabricName: 'Denim Fabric',
      orderDate: '3 June 2025',
      quantity: 250,
      pricePerMeter: 320,
      totalAmount: 80000,
      invoiceNumber: 'INV-2025-002',
    },
    {
      id: 'ORD-1037',
      status: 'Cancelled',
      manufacturerName: 'Lucky Textile',
      fabricName: 'Polyester Blend',
      orderDate: '1 June 2025',
      quantity: 180,
      pricePerMeter: 150,
      totalAmount: 27000,
    },
  ];

  useEffect(() => {
    if (!isLoaded) {
      setOrders(mockOrders);
      filterOrders(mockOrders, selectedTab, searchQuery);
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Separate effect for animations that only runs once
  useEffect(() => {
    const startAnimations = () => {
      searchBarOpacity.value = withTiming(1, { duration: 300 });
      ordersOpacity.value = withTiming(1, { duration: 300 });
    };

    startAnimations();
  }, []);

  useEffect(() => {
    filterOrders(orders, selectedTab, searchQuery);
  }, [selectedTab, searchQuery, orders]);

  const filterOrders = (allOrders: Order[], tab: 'ongoing' | 'past', query: string) => {
    let filtered = allOrders;

    // Filter by tab
    if (tab === 'ongoing') {
      filtered = filtered.filter(order => order.status !== 'Delivered' && order.status !== 'Cancelled');
    } else {
      filtered = filtered.filter(order => order.status === 'Delivered' || order.status === 'Cancelled');
    }

    // Filter by search query
    if (query) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        order.fabricName.toLowerCase().includes(query.toLowerCase()) ||
        order.manufacturerName.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleTabChange = (tab: 'ongoing' | 'past') => {
    setSelectedTab(tab);
    tabIndicatorPosition.value = withSpring(tab === 'ongoing' ? 0 : 1, {
      damping: 15,
      stiffness: 150,
    });
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleViewDetails = (orderId: string) => {
    router.push({
      pathname: '/order-details',
      params: { orderId },
    });
  };

  const handleTrackOrder = (orderId: string) => {
    router.push({
      pathname: '/order-tracking',
      params: { orderId },
    });
  };

  const handleViewInvoice = (invoiceNumber: string) => {
    router.push({
      pathname: '/invoice-detail',
      params: { invoiceNumber },
    });
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'Confirmed':
        return <CheckCircle size={16} color="#059669" />;
      case 'In Transit':
        return <Truck size={16} color="#D97706" />;
      case 'Processing':
        return <Clock size={16} color="#3B82F6" />;
      case 'Delivered':
        return <Package size={16} color="#059669" />;
      case 'Cancelled':
        return <XCircle size={16} color="#DC2626" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Confirmed':
        return { backgroundColor: '#ECFDF5', color: '#059669' };
      case 'In Transit':
        return { backgroundColor: '#FFFBEB', color: '#D97706' };
      case 'Processing':
        return { backgroundColor: '#EFF6FF', color: '#3B82F6' };
      case 'Delivered':
        return { backgroundColor: '#ECFDF5', color: '#059669' };
      case 'Cancelled':
        return { backgroundColor: '#FEF2F2', color: '#DC2626' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#6B7280' };
    }
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            tabIndicatorPosition.value,
            [0, 1],
            [0, 150] // Adjust based on tab width
          ),
        },
      ],
    };
  });

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: searchBarOpacity.value,
    transform: [
      {
        translateY: interpolate(searchBarOpacity.value, [0, 1], [20, 0]),
      },
    ],
  }));

  const ordersAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ordersOpacity.value,
  }));

  const renderOrderCard = (order: Order, index: number) => {
    const isExpanded = expandedOrder === order.id;
    const statusStyle = getStatusColor(order.status);
    
    return (
      <Animated.View
        key={order.id}
        style={[
          styles.orderCard,
          {
            opacity: ordersOpacity.value,
            transform: [
              {
                translateY: interpolate(
                  ordersOpacity.value,
                  [0, 1],
                  [50 + index * 10, 0]
                ),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.orderHeader}
          onPress={() => toggleOrderExpansion(order.id)}
          activeOpacity={0.8}
        >
          <View style={styles.orderMainInfo}>
            <View style={styles.orderTopRow}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                {getStatusIcon(order.status)}
                <Text style={[styles.statusText, { color: statusStyle.color }]}>
                  {order.status}
                </Text>
              </View>
            </View>
            
            <Text style={styles.manufacturerName}>{order.manufacturerName}</Text>
            <Text style={styles.fabricName}>{order.fabricName}</Text>
            
            <View style={styles.orderDetails}>
              <Text style={styles.orderDate}>{order.orderDate}</Text>
              <Text style={styles.orderQuantity}>
                {order.quantity} Meters @ {formatCurrency(order.pricePerMeter)}/m
              </Text>
            </View>
            
            <Text style={styles.totalAmount}>{formatCurrency(order.totalAmount)}</Text>
          </View>
          
          <View style={styles.expandIcon}>
            {isExpanded ? (
              <ChevronUp size={24} color="#666" />
            ) : (
              <ChevronDown size={24} color="#666" />
            )}
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <Animated.View
            style={styles.expandedContent}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            layout={Layout.springify()}
          >
            <View style={styles.expandedSection}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Quantity:</Text>
                <Text style={styles.summaryValue}>{order.quantity} Meters</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Rate:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(order.pricePerMeter)}/meter</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total:</Text>
                <Text style={[styles.summaryValue, styles.totalValue]}>
                  {formatCurrency(order.totalAmount)}
                </Text>
              </View>
              {order.estimatedDelivery && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Est. Delivery:</Text>
                  <Text style={styles.summaryValue}>{order.estimatedDelivery}</Text>
                </View>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleViewDetails(order.id)}
                activeOpacity={0.8}
              >
                <Eye size={16} color="#000" />
                <Text style={styles.actionButtonText}>Details</Text>
              </TouchableOpacity>
              
              {order.trackingNumber && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleTrackOrder(order.id)}
                  activeOpacity={0.8}
                >
                  <Truck size={16} color="#000" />
                  <Text style={styles.actionButtonText}>Track</Text>
                </TouchableOpacity>
              )}
              
              {order.invoiceNumber && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleViewInvoice(order.invoiceNumber!)}
                  activeOpacity={0.8}
                >
                  <Package size={16} color="#000" />
                  <Text style={styles.actionButtonText}>Invoice</Text>
                </TouchableOpacity>
              )}
              
              {order.status === 'Delivered' && (
                <TouchableOpacity style={styles.reorderButton} activeOpacity={0.8}>
                  <RotateCcw size={16} color="#FFF" />
                  <Text style={styles.reorderText}>Reorder</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <Animated.View style={[styles.searchContainer, searchBarAnimatedStyle]}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Order ID or Fabric"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </Animated.View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'ongoing' && styles.activeTab]}
            onPress={() => handleTabChange('ongoing')}
          >
            <Text style={[styles.tabText, selectedTab === 'ongoing' && styles.activeTabText]}>
              Ongoing Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'past' && styles.activeTab]}
            onPress={() => handleTabChange('past')}
          >
            <Text style={[styles.tabText, selectedTab === 'past' && styles.activeTabText]}>
              Past Orders
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
      </View>

      {/* Orders List */}
      <ScrollView 
        style={styles.ordersList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ordersContent}
      >
        <Animated.View style={ordersAnimatedStyle}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => renderOrderCard(order, index))
          ) : (
            <View style={styles.emptyState}>
              <Package size={48} color="#CCC" />
              <Text style={styles.emptyText}>No orders found</Text>
              <Text style={styles.emptySubtext}>
                {selectedTab === 'ongoing' 
                  ? 'You have no ongoing orders at the moment'
                  : 'You have no past orders to display'
                }
              </Text>
            </View>
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  tabsContainer: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingBottom: 16,
    position: 'relative',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    width: 146,
    height: 40,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  ordersList: {
    flex: 1,
  },
  ordersContent: {
    padding: 20,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    padding: 20,
  },
  orderMainInfo: {
    flex: 1,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  manufacturerName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 4,
  },
  fabricName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 12,
  },
  orderDetails: {
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
  orderQuantity: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  expandIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
  },
  expandedSection: {
    padding: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 12,
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
  totalValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  reorderText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});