import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@components';
import { isValidDietaryTag } from '@constants';
import { shadows, useColors } from '@theme';
import { Dish } from '@types';
import { formatCurrency } from '@utils';

type Props = {
  item: Dish;
  onPress?: (item: Dish) => void;
};

export default function DiscountedMenuItemCard({ item, onPress }: Props) {
  const formattedPrice = formatCurrency(item.price);

  const colors = useColors();

  const dietaryTag = item.tags?.find(tag => isValidDietaryTag(tag));

  return (
    <Pressable
      onPress={() => onPress?.(item)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.background },
        shadows.card,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.imageWrapper, { borderBottomColor: colors.attention }]}>
        {item.discountPercent ? (
          <View style={[styles.badge, { backgroundColor: colors.attention }]}>
            <Text color="primaryInverted" weight="medium">{item.discountPercent}% off</Text>
          </View>
        ) : null}

        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: colors.brandPrimaryLight }]} />
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
  imageWrapper: {
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
