import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useCartStore } from '@store';
import { colors } from '@theme';
import { formatCurrency } from '@utils';

import Text from './Text';

type Props = {
  onPress: () => void;
};

export default function FloatingActionButton({ onPress }: Props) {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const getCartSummary = useCartStore((state) => state.getCartSummary);

  // Get subtotal (without delivery fee and tax for the button)
  const subtotal = getCartSummary(0, 0).subtotal;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.badge}>
        <Text size="body" weight="medium" color="primaryInverted">
          {totalItems > 99 ? '99+' : totalItems}
        </Text>
      </View>

      <View style={styles.buttonTextContainer}>
        <Text size="heading1" weight="bold" color="primaryInverted">
          View basket
        </Text>
      </View>

      <Text size="heading1" weight="bold" color="primaryInverted" style={styles.priceText}>
        {formatCurrency(subtotal)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.brandPrimaryDark,
    borderRadius: 3,
    height: 24,
    justifyContent: 'center',
    minWidth: 24,
    paddingHorizontal: 8,
  },
  button: {
    alignItems: 'center',
    backgroundColor: colors.brandPrimary,
    borderRadius: 4,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonTextContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
  priceText: {
    textAlign: 'right',
  },
});

