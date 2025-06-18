import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { AnimatedButton } from '@/components/AnimatedButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WelcomeScreen() {
  const { t } = useLanguage();
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

  const handleSignUp = () => {
    router.push('/phone-login');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LanguageSwitcher />
      
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <View style={styles.heroSection}>
          <Image
            source={{
              uri: 'https://images.pexels.com/photos/236748/pexels-photo-236748.jpeg?_gl=1*1px4s82*_ga*NDk4MzQ4NDMzLjE3NTAyMjQ1Nzk.*_ga_8JE65Q40S6*czE3NTAyMjQ1NzgkbzEkZzEkdDE3NTAyMjQ2NzMkajM1JGwwJGgw',
            }}
            style={styles.heroImage}
          />
          
          <Text style={styles.title}>{t('welcome')}</Text>
          <Text style={styles.subtitle}>{t('tagline')}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <AnimatedButton
            title="Sign In"
            onPress={handleSignIn}
            style={styles.button}
            variant="outline"
          />
          <View style={styles.buttonSpacer} />
          <AnimatedButton
            title="Sign Up"
            onPress={handleSignUp}
            style={styles.button}
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
    paddingVertical: 40,
  },
  heroSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  heroImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
  },
  buttonSpacer: {
    height: 16,
  },
});