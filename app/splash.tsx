import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { FabricRipple } from '@/components/FabricRipple';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SplashScreen() {
  const { t } = useLanguage();
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Logo animation
    logoScale.value = withSequence(
      withTiming(1.2, { duration: 800 }),
      withTiming(1, { duration: 200 })
    );
    logoOpacity.value = withTiming(1, { duration: 800 });

    // Text animation
    textOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));

    // Navigate to welcome after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <FabricRipple />
      
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>{t('appName')}</Text>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.tagline, textAnimatedStyle]}>
        {t('tagline')}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  logoText: {
    color: '#FFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});