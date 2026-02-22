import React from 'react';
import { View, Text, Animated } from 'react-native';

interface TypingIndicatorProps {
  userName: string;
}

export default function TypingIndicator({ userName }: TypingIndicatorProps): React.ReactElement {
  const dotScale1 = React.useRef(new Animated.Value(0.5)).current;
  const dotScale2 = React.useRef(new Animated.Value(0.5)).current;
  const dotScale3 = React.useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    const createDotAnimation = (dotScale: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dotScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(dotScale, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: false,
          }),
        ])
      );
    };

    createDotAnimation(dotScale1, 0).start();
    createDotAnimation(dotScale2, 200).start();
    createDotAnimation(dotScale3, 400).start();
  }, [dotScale1, dotScale2, dotScale3]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        marginHorizontal: 12,
        gap: 4,
      }}
    >
      <View
        style={{
          backgroundColor: '#334155',
          borderRadius: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Text style={{ color: '#94a3b8', fontSize: 13, marginRight: 4 }}>
          {userName} is typing
        </Text>

        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#64748b',
            transform: [{ scaleY: dotScale1 }],
          }}
        />
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#64748b',
            transform: [{ scaleY: dotScale2 }],
          }}
        />
        <Animated.View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#64748b',
            transform: [{ scaleY: dotScale3 }],
          }}
        />
      </View>
    </View>
  );
}
