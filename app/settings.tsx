import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Building, Bell, Globe, CircleHelp as HelpCircle, Phone, Mail, LogOut, CreditCard as Edit3, Save, X, ChevronRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NotificationSettings {
  orderUpdates: boolean;
  paymentReminders: boolean;
  newOffers: boolean;
  systemUpdates: boolean;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function SettingsScreen() {
  const { user, logout, updateUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    orderUpdates: true,
    paymentReminders: true,
    newOffers: false,
    systemUpdates: true,
  });

  // Animation values
  const headerOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const profileOpacity = useSharedValue(0);

  useEffect(() => {
    // Start animations
    headerOpacity.value = withTiming(1, { duration: 600 });
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 800 }));
    profileOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
  }, []);

  const handleSaveProfile = () => {
    if (editedUser) {
      updateUser(editedUser);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    }
  };

  const handleCancelEdit = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/splash');
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Support contact options would appear here');
  };

  const handleHelp = () => {
    Alert.alert('Help & FAQ', 'Help documentation would open here');
  };

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
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

  const profileAnimatedStyle = useAnimatedStyle(() => ({
    opacity: profileOpacity.value,
    transform: [
      {
        translateY: interpolate(profileOpacity.value, [0, 1], [30, 0]),
      },
    ],
  }));

  const renderEditableField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder?: string
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
        />
      ) : (
        <Text style={styles.fieldValue}>{value || 'Not provided'}</Text>
      )}
    </View>
  );

  const renderNotificationToggle = (
    title: string,
    description: string,
    value: boolean,
    onToggle: () => void
  ) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationInfo}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#F0F0F0', true: '#000' }}
        thumbColor={value ? '#FFF' : '#FFF'}
      />
    </View>
  );

  const renderSettingsItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    showChevron: boolean = true
  ) => (
    <TouchableOpacity
      style={styles.settingsItem}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.settingsItemIcon}>{icon}</View>
      <View style={styles.settingsItemContent}>
        <Text style={styles.settingsItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
      </View>
      {showChevron && <ChevronRight size={20} color="#CCC" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <Text style={styles.headerTitle}>Settings</Text>
        {isEditing ? (
          <View style={styles.editActions}>
            <TouchableOpacity
              style={styles.editActionButton}
              onPress={handleCancelEdit}
              activeOpacity={0.8}
            >
              <X size={20} color="#DC2626" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editActionButton}
              onPress={handleSaveProfile}
              activeOpacity={0.8}
            >
              <Save size={20} color="#059669" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
            activeOpacity={0.8}
          >
            <Edit3 size={20} color="#000" />
          </TouchableOpacity>
        )}
      </Animated.View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Section */}
        <Animated.View style={[styles.profileSection, profileAnimatedStyle]}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatar}>
                <User size={32} color="#FFF" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name}</Text>
                <Text style={styles.profileShop}>{user?.shopName}</Text>
                <Text style={styles.profileMarket}>{user?.market}</Text>
              </View>
            </View>

            <View style={styles.profileDetails}>
              {renderEditableField(
                'Full Name',
                editedUser?.name || '',
                (text) => setEditedUser(prev => prev ? { ...prev, name: text } : null),
                'Enter your full name'
              )}
              
              {renderEditableField(
                'Shop Name',
                editedUser?.shopName || '',
                (text) => setEditedUser(prev => prev ? { ...prev, shopName: text } : null),
                'Enter your shop name'
              )}
              
              {renderEditableField(
                'Market/Area',
                editedUser?.market || '',
                (text) => setEditedUser(prev => prev ? { ...prev, market: text } : null),
                'Enter your market or area'
              )}
              
              {renderEditableField(
                'Phone Number',
                editedUser?.phone || '',
                (text) => setEditedUser(prev => prev ? { ...prev, phone: text } : null),
                'Enter your phone number'
              )}
              
              {renderEditableField(
                'CNIC',
                editedUser?.cnic || '',
                (text) => setEditedUser(prev => prev ? { ...prev, cnic: text } : null),
                'Enter your CNIC (optional)'
              )}
            </View>
          </View>
        </Animated.View>

        {/* Notifications */}
        <Animated.View style={[styles.section, contentAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionCard}>
            {renderNotificationToggle(
              'Order Updates',
              'Get notified about order status changes',
              notifications.orderUpdates,
              () => toggleNotification('orderUpdates')
            )}
            
            {renderNotificationToggle(
              'Payment Reminders',
              'Receive reminders for due payments',
              notifications.paymentReminders,
              () => toggleNotification('paymentReminders')
            )}
            
            {renderNotificationToggle(
              'New Offers',
              'Get notified about special offers and deals',
              notifications.newOffers,
              () => toggleNotification('newOffers')
            )}
            
            {renderNotificationToggle(
              'System Updates',
              'Important app updates and announcements',
              notifications.systemUpdates,
              () => toggleNotification('systemUpdates')
            )}
          </View>
        </Animated.View>

        {/* Language */}
        <Animated.View style={[styles.section, contentAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Language</Text>
          <View style={styles.sectionCard}>
            <View style={styles.languageContainer}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language === 'en' && styles.activeLanguageButton,
                ]}
                onPress={() => setLanguage('en')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.languageText,
                    language === 'en' && styles.activeLanguageText,
                  ]}
                >
                  English
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  language === 'ur' && styles.activeLanguageButton,
                ]}
                onPress={() => setLanguage('ur')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.languageText,
                    language === 'ur' && styles.activeLanguageText,
                  ]}
                >
                  اردو
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Support & Help */}
        <Animated.View style={[styles.section, contentAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Support & Help</Text>
          <View style={styles.sectionCard}>
            {renderSettingsItem(
              <HelpCircle size={20} color="#666" />,
              'Help & FAQ',
              'Get answers to common questions',
              handleHelp
            )}
            
            {renderSettingsItem(
              <Phone size={20} color="#666" />,
              'Contact Support',
              'Get help from our support team',
              handleContactSupport
            )}
            
            {renderSettingsItem(
              <Mail size={20} color="#666" />,
              'Send Feedback',
              'Help us improve the app',
              () => Alert.alert('Feedback', 'Feedback form would open here')
            )}
          </View>
        </Animated.View>

        {/* Account */}
        <Animated.View style={[styles.section, contentAnimatedStyle]}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionCard}>
            {renderSettingsItem(
              <LogOut size={20} color="#DC2626" />,
              'Logout',
              'Sign out of your account',
              handleLogout,
              false
            )}
          </View>
        </Animated.View>

        {/* App Version */}
        <Animated.View style={[styles.versionSection, contentAnimatedStyle]}>
          <Text style={styles.versionText}>KapraPro v1.0.0</Text>
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
    justifyContent: 'space-between',
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
  editButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  profileSection: {
    padding: 20,
  },
  profileCard: {
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 4,
  },
  profileShop: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginBottom: 2,
  },
  profileMarket: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  profileDetails: {
    gap: 16,
  },
  fieldContainer: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
    paddingVertical: 8,
  },
  fieldInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 12,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  languageContainer: {
    flexDirection: 'row',
    padding: 4,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    margin: 16,
  },
  languageButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeLanguageButton: {
    backgroundColor: '#000',
  },
  languageText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeLanguageText: {
    color: '#FFF',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  settingsItemIcon: {
    marginRight: 16,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
});