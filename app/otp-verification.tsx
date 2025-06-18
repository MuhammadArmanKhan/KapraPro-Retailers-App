import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { Shield } from 'lucide-react-native';
import { AnimatedButton } from '@/components/AnimatedButton';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OTPVerificationScreen() {
  const { t } = useLanguage();
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  const containerOpacity = useSharedValue(0);
  const contentTranslateY = useSharedValue(50);
  const successScale = useSharedValue(0);

  useEffect(() => {
    containerOpacity.value = withTiming(1, { duration: 800 });
    contentTranslateY.value = withDelay(200, withTiming(0, { duration: 600 }));
    
    // Start resend timer
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
  }));

  const successAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 4) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Success animation
      successScale.value = withSpring(1, { duration: 600 });
      
      setTimeout(() => {
        router.push({
          pathname: '/password-setup',
          params: { phone }
        });
      }, 1000);
    }, 2000);
  };

  const handleResendCode = () => {
    if (resendTimer > 0) return;
    
    setResendTimer(30);
    setOtp(['', '', '', '']);
    inputRefs.current[0]?.focus();
    Alert.alert('Success', 'Verification code sent!');
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <LanguageSwitcher />
      
      <Animated.View style={[styles.content, contentAnimatedStyle]}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield color="#000" size={32} />
          </View>
          <Text style={styles.title}>{t('verifyPhone')}</Text>
          <Text style={styles.subtitle}>
            {t('otpSent')} {phone}
          </Text>
        </View>

        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>{t('enterOtp')}</Text>
          <View style={styles.otpInputs}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  digit && styles.otpInputFilled,
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => 
                  handleKeyPress(nativeEvent.key, index)
                }
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.loadingBar}>
                <Animated.View style={[styles.loadingProgress, successAnimatedStyle]} />
              </View>
              <Text style={styles.loadingText}>{t('verifying')}</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.resendButton, resendTimer > 0 && styles.resendDisabled]}
            onPress={handleResendCode}
            disabled={resendTimer > 0}
          >
            <Text style={[styles.resendText, resendTimer > 0 && styles.resendTextDisabled]}>
              {resendTimer > 0 ? `${t('resendCode')} (${resendTimer}s)` : t('resendCode')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <AnimatedButton
            title={t('verify')}
            onPress={handleVerify}
            disabled={!isOtpComplete}
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
  otpContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  otpLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginBottom: 20,
  },
  otpInputs: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    borderWidth: 2,
    borderColor: 'transparent',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  otpInputFilled: {
    borderColor: '#000',
    backgroundColor: '#FFF',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: '#F0F0F0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: '#000',
    width: '100%',
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  actions: {
    alignItems: 'center',
    marginBottom: 40,
  },
  resendButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  resendDisabled: {
    opacity: 0.5,
  },
  resendText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
  },
  resendTextDisabled: {
    color: '#999',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
});