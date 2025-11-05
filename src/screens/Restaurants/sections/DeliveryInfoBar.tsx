import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Icon, Text } from '@components';
import { useColors } from '@theme';

type Props = {
  deliveryAddress: string;
  cartItemCount: number;
  onAddressPress?: () => void;
  onDeliveryOptionPress?: () => void;
  onCartPress?: () => void;
};

export default function DeliveryInfoBar({
  deliveryAddress,
  cartItemCount,
  onAddressPress,
  onDeliveryOptionPress,
  onCartPress,
}: Props) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addressSection} onPress={onAddressPress} activeOpacity={0.7}>
        <Text size="body" weight="medium" color="primary">
          Deliver now
        </Text>
        <View style={styles.addressRow}>
          <Text size="body" color="secondary" numberOfLines={1}>
            {deliveryAddress}
          </Text>
          <Icon name="CaretDownIcon" size={16} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <TouchableOpacity style={[styles.deliveryButton, { backgroundColor: colors.inactive }]} onPress={onDeliveryOptionPress} activeOpacity={0.7}>
          <Text size="body" weight="medium" color="secondary">
            Delivery
          </Text>
          <Icon name="CaretDownIcon" size={16} color={colors.textPrimary} />
        </TouchableOpacity>

        {cartItemCount > 0 && (
          <TouchableOpacity style={styles.cartButton} onPress={onCartPress} activeOpacity={0.7}>
            <View style={[styles.cartBadge, { backgroundColor: colors.success }]}>
              <Text size="small" weight="bold" color="primaryInverted">
                {cartItemCount}
              </Text>
            </View>
            <Icon name="ShoppingCartIcon" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  addressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  addressSection: {
    flex: 1,
  },
  cartBadge: {
    alignItems: 'center',
    borderRadius: 10,
    height: 20,
    justifyContent: 'center',
    minWidth: 20,
    paddingHorizontal: 6,
    position: 'absolute',
    right: -4,
    top: -4,
    zIndex: 1,
  },
  cartButton: {
    marginLeft: 12,
    position: 'relative',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deliveryButton: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rightSection: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

