import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Settings, User, Building2 } from 'lucide-react-native';
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <User size={40} color="#FFF" />
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.shopName}>{user?.shopName}</Text>
          <Text style={styles.market}>{user?.market}</Text>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleManufacturerProfile}>
            <Building2 size={24} color="#000" />
            <Text style={styles.menuText}>Manufacturer Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
            <Settings size={24} color="#000" />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <LogOut size={24} color="#DC2626" />
            <Text style={[styles.menuText, { color: '#DC2626' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  menu: {
    gap: 16,
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
});