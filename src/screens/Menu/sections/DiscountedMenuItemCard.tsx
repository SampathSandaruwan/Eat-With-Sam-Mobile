import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@components';
import { isValidDietaryTag } from '@constants';
import { colors, shadows } from '@theme';
import { MenuItem } from '@types';
import { formatCurrency } from '@utils';

type Props = {
  item: MenuItem;
  onPress?: (item: MenuItem) => void;
};

export default function DiscountedMenuItemCard({ item, onPress }: Props) {
  const formattedPrice = formatCurrency(item.price);

  const dietaryTag = item.tags?.find(tag => isValidDietaryTag(tag));

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.imageWrapper}>
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
      </View>

      <View style={styles.content}>
        <Text weight="bold" numberOfLines={2} size="heading1">{item.name}</Text>
        {!!item.description && (
          <Text color="secondary" numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
        )}

        <View style={styles.bottomSection}>
          {typeof item.kcal === 'number' && (
            <Text color="secondary" style={styles.kcalLine} size="body">
              {item.kcal} kcal
            </Text>
          )}
          <View style={styles.priceRow}>
            <Text color="secondary">{formattedPrice}</Text>
            {dietaryTag && (
              <>
                <Text color="secondary"> • </Text>
                <Text color="success">{dietaryTag}</Text>
              </>
            )}
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
    height: 292,
    marginBottom: 8,
    marginHorizontal: 2,
    width: 220,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
  },
  description: {
    marginTop: 4,
  },
  image: {
    height: 132,
    width: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.brandPrimaryLight,
  },
  imageWrapper: {
    borderBottomColor: colors.attention,
    borderBottomWidth: 3,
  },
  kcalLine: {
    marginBottom: 4,
  },
  pressed: {
    opacity: 0.7,
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
