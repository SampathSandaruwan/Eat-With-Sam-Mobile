import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@components';
import { useColors, useShadows } from '@theme';
import { MenuItem } from '@types';
import { formatCurrency } from '@utils';

type Props = {
  item: MenuItem;
  onPress?: (item: MenuItem) => void;
};

export default function TopRatedMenuItemCard({ item, onPress }: Props) {
  const formattedPrice = formatCurrency(item.price);
  const formattedKcal = item.kcal ? `${item.kcal} kcal` : null;

  const colors = useColors();
  const shadows = useShadows();

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
      {item.imageUri && (
        <View>
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        </View>
      )}

      <View style={styles.content}>
        <Text weight="bold" numberOfLines={2} size="heading1">{item.name}</Text>
        {formattedKcal && (
          <Text size="heading1">{formattedKcal}</Text>
        )}
        <Text size="heading1">{formattedPrice}</Text>
      </View>

      {item.discountPercent ? (
        <View style={[styles.badge, { backgroundColor: colors.attention }]}>
          <Text color="primaryInverted" weight="medium">{item.discountPercent}% off</Text>
        </View>
      ) : null}

      <View style={[styles.plusButtonWrapper, { backgroundColor: colors.background }, shadows.roundedCard]}>
        <Icon name="PlusIcon" size={20} color={colors.brandPrimaryLight} weight="bold" />
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
  card: {
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    height: 100,
    marginBottom: 8,
    marginHorizontal: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 300,
  },
  content: {
    flexDirection: 'column',
    height: '100%',
    paddingHorizontal: 12,
    width: 156,
  },
  image: {
    height: 88,
    width: 88,
  },
  plusButtonWrapper: {
    alignItems: 'center',
    borderRadius: 100,
    bottom: 8,
    height: 42,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    width: 42,
  },
  pressed: {
    opacity: 0.7,
  },
});
