import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { LogIn } from 'lucide-react-native';
import { AnimatedButton } from '@/components/AnimatedButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

export default function SignInScreen() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
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

  const isValidPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, '');
    return cleanPhone.length === 11 && cleanPhone.startsWith('03');
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,4})(\d{0,7})$/);
    if (match) {
      return !match[2] ? match[1] : `${match[1]} ${match[2]}`;
    }
    return text;
  };

  const handlePhoneChange = (text: string) => {
    if (text.replace(/\s/g, '').length <= 11) {
      setPhoneNumber(formatPhoneNumber(text));
    }
  };

  const handleSignIn = async () => {
    if (!isValidPhone(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login({ phone: phoneNumber, password });
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Invalid phone number or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push('/phone-login');
  };

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LanguageSwitcher />
      
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LogIn color="#000" size={32} />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={handlePhoneChange}
              placeholder="03XX XXXXXXX"
              keyboardType="numeric"
              maxLength={12}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AnimatedButton
            title="Sign In"
            onPress={handleSignIn}
            disabled={!isValidPhone(phoneNumber) || password.length < 8}
            loading={isLoading}
          />
          
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account?</Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
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
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginRight: 8,
  },
  signupLink: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
}); 