import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useCartStore } from '@store';
import { colors, shadows } from '@theme';

import Icon from './Icon';
import Text from './Text';

type Props = {
  onPress: () => void;
};

export default function FloatingActionButton({ onPress }: Props) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <Icon name="ShoppingCartIcon" size={24} color={colors.brandYellow} weight="bold" />
      {totalItems > 0 && (
        <View style={styles.badge}>
          <Text size="small" weight="bold" color="primaryInverted">
            {totalItems > 99 ? '99+' : totalItems}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    minWidth: 20,
    paddingHorizontal: 6,
    position: 'absolute',
    right: -8,
    top: -8,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  pressed: {
    opacity: 0.8,
  },
});

