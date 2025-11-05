import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@components';
import {
  CATEGORY_WISE_MENU_ITEM_CARD_HEIGHT,
  CATEGORY_WISE_MENU_ITEM_CARD_MARGIN_VERTICAL,
  SCREEN_WIDTH,
  useColors,
  useShadows,
} from '@theme';
import { Dish } from '@types';
import { formatCurrency } from '@utils';


type Props = {
  item: Dish;
  onPress?: (item: Dish) => void;
};

export default function CategoryWiseMenuItemCard({ item, onPress }: Props) {
  const formattedPrice = formatCurrency(item.price);

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
            <Text color="secondary" size="body">{formattedPrice}</Text>
            {item.discountPercent ? (
              <Text color="attention" style={styles.discountText} size="body">
                {' '}{item.discountPercent}% off
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          {item.discountPercent ? (
            <View style={[styles.badge, { backgroundColor: colors.attention }]}>
              <Icon name="TagIcon" size={16} color={colors.background} weight="bold" mirrored />
            </View>
          ) : null}

          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={styles.image} />
          ) : (
            <View style={[styles.image, { backgroundColor: colors.brandPrimaryLight }, styles.imagePlaceholder]} />
          )}

          <View style={[styles.plusButtonWrapper, { backgroundColor: colors.background }, shadows.card]}>
            <Icon name="PlusIcon" size={20} color={colors.brandPrimary} weight="bold" />
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
    paddingHorizontal: 4,
    paddingVertical: 4,
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
  },
  bottomSection: {
    marginTop: 'auto',
  },
  card: {
    borderRadius: 4,
    flexDirection: 'row',
    height: CATEGORY_WISE_MENU_ITEM_CARD_HEIGHT,
    marginHorizontal: -16,
    marginVertical: CATEGORY_WISE_MENU_ITEM_CARD_MARGIN_VERTICAL,
    paddingHorizontal: 16,
    width: SCREEN_WIDTH,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: 12,
    paddingVertical: 12,
  },
  description: {
    marginBottom: 8,
    marginTop: 4,
  },
  discountText: {
    marginLeft: 4,
  },
  image: {
    borderRadius: 4,
    height: 98,
    resizeMode: 'cover',
    width: 98,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 98,
  },
  imagePlaceholder: {
    borderRadius: 4,
  },
  imageWrapper: {
    alignSelf: 'flex-start',
    marginTop: 12,
    overflow: 'visible',
    paddingBottom: 12,
    position: 'relative',
    width: 98,
  },
  kcalLine: {
    marginBottom: 4,
  },
  plusButtonWrapper: {
    alignItems: 'center',
    borderRadius: 100,
    bottom: 0,
    height: 42,
    justifyContent: 'center',
    position: 'absolute',
    right: -12,
    width: 42,
  },
  pressed: {
    opacity: 0.7,
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
