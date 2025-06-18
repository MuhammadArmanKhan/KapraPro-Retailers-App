import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { User } from 'lucide-react-native';
import { AnimatedButton } from '@/components/AnimatedButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileFormScreen() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    market: '',
    phone: '',
    cnic: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const containerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 800 });
    contentTranslateY.value = withDelay(200, withTiming(0, { duration: 600 }));
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCNIC = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,5})(\d{0,7})(\d{0,1})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }
    return text;
  };

  const handleCNICChange = (text: string) => {
    if (text.replace(/\D/g, '').length <= 13) {
      handleFieldChange('cnic', formatCNIC(text));
    }
  };

  const isFormValid = () => {
    return formData.name.trim() && formData.shopName.trim() && formData.market.trim();
  };

  const handleCompleteSetup = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call login with the correct data structure
      await login({
        phone: formData.phone,
        userData: {
          id: Date.now().toString(),
          name: formData.name,
          shopName: formData.shopName,
          market: formData.market,
          cnic: formData.cnic || undefined,
        },
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete setup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LanguageSwitcher />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <User color="#000" size={32} />
            </View>
            <Text style={styles.title}>{t('completeProfile')}</Text>
            <Text style={styles.subtitle}>{t('profileHint')}</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>{t('name')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleFieldChange('name', text)}
                placeholder={t('namePlaceholder')}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('shopName')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.shopName}
                onChangeText={(text) => handleFieldChange('shopName', text)}
                placeholder={t('shopPlaceholder')}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('market')} *</Text>
              <TextInput
                style={styles.input}
                value={formData.market}
                onChangeText={(text) => handleFieldChange('market', text)}
                placeholder={t('marketPlaceholder')}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>{t('cnic')}</Text>
              <TextInput
                style={styles.input}
                value={formData.cnic}
                onChangeText={handleCNICChange}
                placeholder={t('cnicPlaceholder')}
                keyboardType="numeric"
                maxLength={15}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <AnimatedButton
              title={t('completeSetup')}
              onPress={handleCompleteSetup}
              disabled={!isFormValid()}
              loading={isLoading}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 40,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonContainer: {
    marginTop: 20,
  },
});