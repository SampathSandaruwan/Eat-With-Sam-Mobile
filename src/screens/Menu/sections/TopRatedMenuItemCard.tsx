import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@components';
import { colors, shadows } from '@theme';
import { MenuItem } from '@types';
import { formatCurrency } from '@utils';

type Props = {
  item: MenuItem;
  onPress?: (item: MenuItem) => void;
};

export default function TopRatedMenuItemCard({ item, onPress }: Props) {
  const formattedPrice = formatCurrency(item.price);

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <View>
        {item.discountPercent ? (
          <View style={styles.badge}>
            <Text color="primaryInverted" weight="medium">{item.discountPercent}% off</Text>
          </View>
        ) : null}

        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}

        <View style={[styles.plusButtonWrapper, shadows.card]}>
          <Icon name="PlusIcon" size={20} color={colors.brandPrimary} weight="bold" />
        </View>
      </View>

      <View style={styles.content}>
        <Text weight="bold" numberOfLines={2} size="small">{item.name}</Text>

        <View style={styles.bottomSection}>
          {typeof item.kcal === 'number' && (
            <Text color="secondary" style={styles.kcalLine} size="small">
              {item.kcal} kcal
            </Text>
          )}
          <View style={styles.priceRow}>
            <Text color="secondary" size="small">{formattedPrice}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.attention,
    borderRadius: 3,
    height: 24,
    left: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
    position: 'absolute',
    top: 12,
    zIndex: 1,
  },
  bottomSection: {
    marginTop: 'auto',
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: 4,
    flexDirection: 'column',
    height: 216,
    marginBottom: 8,
    marginHorizontal: 2,
    width: 124,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
  },
  image: {
    height: 124,
    width: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.brandPrimaryLight,
  },
  kcalLine: {
    marginBottom: 4,
  },
  plusButtonWrapper: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 100,
    bottom: -8,
    height: 42,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    width: 42,
  },
  pressed: {
    opacity: 0.7,
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
