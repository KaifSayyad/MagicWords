import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  style,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
  };

  return (
    <AnimatedTouchable
      style={[styles.button, style, animatedStyle]}
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      {children}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
  },
});

export default AnimatedButton;