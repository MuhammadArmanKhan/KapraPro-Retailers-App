import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Settings, User, Building2, Phone, Mail, MapPin, Edit2, Bell, ShoppingBag, CreditCard, Heart } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    router.replace('/splash');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleManufacturerProfile = () => {
    router.push('/manufacturer-profile');
  };

  const handleEditProfile = () => {
    router.push('/profile-form');
  };

  const stats = [
    { label: 'Orders', value: '24', icon: ShoppingBag },
    { label: 'Credit', value: 'Rs. 50,000', icon: CreditCard },
    { label: 'Favorites', value: '12', icon: Heart },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={40} color="#FFF" />
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Edit2 size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.shopName}>{user?.shopName}</Text>
          <Text style={styles.market}>{user?.market}</Text>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <stat.icon size={24} color="#000" style={styles.statIcon} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoItem}>
            <Phone size={20} color="#666" />
            <Text style={styles.infoText}>{user?.phone || '+92 XXX XXXXXXX'}</Text>
          </View>
          <View style={styles.infoItem}>
            <Mail size={20} color="#666" />
            <Text style={styles.infoText}>{user?.email || 'email@example.com'}</Text>
          </View>
          <View style={styles.infoItem}>
            <MapPin size={20} color="#666" />
            <Text style={styles.infoText}>{user?.address || 'Shop Address'}</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleManufacturerProfile}>
            <Building2 size={24} color="#000" />
            <Text style={styles.menuText}>Manufacturer Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/notifications')}>
            <Bell size={24} color="#000" />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <Settings size={24} color="#000" />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
            <LogOut size={24} color="#FFF" />
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#000',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 4,
  },
  shopName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginBottom: 4,
  },
  market: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  infoSection: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 12,
  },
  menu: {
    gap: 12,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    marginTop: 8,
  },
  logoutText: {
    color: '#FFF',
  },
});