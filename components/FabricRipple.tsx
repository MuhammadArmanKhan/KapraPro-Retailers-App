import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export function FabricRipple() {
  const scale1 = useSharedValue(0);
  const scale2 = useSharedValue(0);
  const scale3 = useSharedValue(0);
  const opacity1 = useSharedValue(0.8);
  const opacity2 = useSharedValue(0.6);
  const opacity3 = useSharedValue(0.4);

  useEffect(() => {
    const duration = 2000;
    
    scale1.value = withRepeat(
      withSequence(
        withTiming(1, { duration }),
        withTiming(0, { duration: 0 })
      ),
      -1
    );
    
    setTimeout(() => {
      scale2.value = withRepeat(
        withSequence(
          withTiming(1, { duration }),
          withTiming(0, { duration: 0 })
        ),
        -1
      );
    }, 700);
    
    setTimeout(() => {
      scale3.value = withRepeat(
        withSequence(
          withTiming(1, { duration }),
          withTiming(0, { duration: 0 })
        ),
        -1
      );
    }, 1400);

    opacity1.value = withRepeat(
      withSequence(
        withTiming(0, { duration }),
        withTiming(0.8, { duration: 0 })
      ),
      -1
    );
    
    setTimeout(() => {
      opacity2.value = withRepeat(
        withSequence(
          withTiming(0, { duration }),
          withTiming(0.6, { duration: 0 })
        ),
        -1
      );
    }, 700);
    
    setTimeout(() => {
      opacity3.value = withRepeat(
        withSequence(
          withTiming(0, { duration }),
          withTiming(0.4, { duration: 0 })
        ),
        -1
      );
    }, 1400);
  }, []);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ scale: scale3.value }],
    opacity: opacity3.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ripple, animatedStyle1]} />
      <Animated.View style={[styles.ripple, animatedStyle2]} />
      <Animated.View style={[styles.ripple, animatedStyle3]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -100 }, { translateY: -100 }],
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#000',
    left: -100,
    top: -100,
  },
});