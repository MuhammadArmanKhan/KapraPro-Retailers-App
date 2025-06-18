import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'solid' | 'outline';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function AnimatedButton({ 
  onPress, 
  title, 
  style, 
  disabled = false, 
  loading = false,
  variant = 'solid'
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);

  const handlePress = () => {
    if (disabled || loading) return;
    
    scale.value = withSequence(
      withSpring(0.95, { duration: 100 }),
      withSpring(1.05, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    
    setTimeout(onPress, 200);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchable
      style={[
        styles.button,
        variant === 'outline' && styles.outlineButton,
        style,
        disabled && styles.disabled,
        variant === 'outline' && disabled && styles.outlineDisabled,
        animatedStyle,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      <Text 
        style={[
          styles.text,
          variant === 'outline' && styles.outlineText,
          disabled && styles.disabledText,
          variant === 'outline' && disabled && styles.outlineDisabledText,
        ]}
      >
        {loading ? '...' : title}
      </Text>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#000',
  },
  disabled: {
    backgroundColor: '#CCC',
  },
  outlineDisabled: {
    backgroundColor: 'transparent',
    borderColor: '#CCC',
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  outlineText: {
    color: '#000',
  },
  disabledText: {
    color: '#999',
  },
  outlineDisabledText: {
    color: '#CCC',
  },
});