import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Lock } from 'lucide-react-native';
import { AnimatedButton } from '@/components/AnimatedButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PasswordSetupScreen() {
  const { t } = useLanguage();
  const { phone } = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const isValidPassword = (pass: string) => {
    return pass.length >= 8;
  };

  const handleContinue = async () => {
    if (!isValidPassword(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      await setPassword(phone as string, password);
      router.push('/profile-form');
    } catch (error) {
      Alert.alert('Error', 'Failed to set password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LanguageSwitcher />
      
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Lock color="#000" size={32} />
          </View>
          <Text style={styles.title}>Set Password</Text>
          <Text style={styles.subtitle}>Create a secure password for your account</Text>
        </View>

        <View style={styles.form}>
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <AnimatedButton
            title="Continue"
            onPress={handleContinue}
            disabled={!isValidPassword(password) || password !== confirmPassword}
            loading={isLoading}
          />
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
}); 