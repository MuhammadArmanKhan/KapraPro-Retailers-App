import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Bell, ChevronLeft, Package, CreditCard, ShoppingBag, AlertCircle } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'You have received a new order #12345',
    time: '2 mins ago',
    icon: ShoppingBag,
    read: false,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Successful',
    message: 'Payment received for order #12344',
    time: '1 hour ago',
    icon: CreditCard,
    read: false,
  },
  {
    id: '3',
    type: 'product',
    title: 'Product Update',
    message: 'New products have been added to your catalog',
    time: '2 hours ago',
    icon: Package,
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update',
    message: 'App update available with new features',
    time: '1 day ago',
    icon: AlertCircle,
    read: true,
  },
];

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function NotificationsScreen() {
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

  const handleNotificationPress = (notification: typeof NOTIFICATIONS[0]) => {
    // Handle notification press based on type
    switch (notification.type) {
      case 'order':
        router.push('/order-details');
        break;
      case 'payment':
        router.push('/invoice-detail');
        break;
      case 'product':
        router.push('/(tabs)/catalog');
        break;
      default:
        // Handle other notification types
        break;
    }
  };

  const NotificationItem = React.memo(({ item }: { item: typeof NOTIFICATIONS[0] }) => {
    const scale = useSharedValue(1);

    const handlePress = () => {
      scale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      handleNotificationPress(item);
    };

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const Icon = item.icon;

    return (
      <AnimatedTouchable
        style={[styles.notificationItem, !item.read && styles.unread, animatedStyle]}
        onPress={handlePress}
      >
        <View style={[styles.iconContainer, !item.read && styles.unreadIcon]}>
          <Icon size={24} color={item.read ? '#666' : '#000'} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, !item.read && styles.unreadText]}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </AnimatedTouchable>
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Bell size={24} color="#000" />
          <Text style={styles.title}>Notifications</Text>
        </View>
        <View style={styles.backButton} />
      </Animated.View>

      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <FlatList
          data={NOTIFICATIONS}
          renderItem={({ item }) => <NotificationItem item={item} />}
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
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  unread: {
    backgroundColor: '#F8F8F8',
    borderColor: '#000',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  unreadIcon: {
    backgroundColor: '#000',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginBottom: 4,
  },
  unreadText: {
    color: '#000',
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
}); 