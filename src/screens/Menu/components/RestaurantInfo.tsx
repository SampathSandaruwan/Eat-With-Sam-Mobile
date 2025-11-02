import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@components';
import { colors } from '@theme';
import { Restaurant } from '@types';
import { calculateDeliveryTime } from '@utils';

import { FoodItemsPlaceholder } from '../../../assets/images';

type Props = {
    restaurant: Restaurant;
    onPressStartGroupOrder: () => void;
    onPressBack?: () => void;
    onPressInfo?: () => void;
    onPressRating?: () => void;
    onPressDeliveryTime?: () => void;
}

export default function RestaurantInfo({
  restaurant,
  onPressStartGroupOrder,
  onPressBack,
  onPressInfo,
  onPressRating,
  onPressDeliveryTime,
}: Props) {
  const deliveryTime = restaurant.deliveryTime || 20;
  const deliveryTimeRange = calculateDeliveryTime(deliveryTime);

  const formatCurrency = (amount: number) => {
    return `£${amount.toFixed(2)}`;
  };

  // Concatenate details at JS level for natural line breaking
  const firstDetailsRow = [
    `${deliveryTimeRange.minTime} - ${deliveryTimeRange.maxTime} min`,
    restaurant.cuisineType,
    restaurant.description,
  ]
    .filter(Boolean)
    .join(' · ');

  const secondDetailsRow = [
    `${formatCurrency(restaurant.minimumOrder)} minimum`,
    `${formatCurrency(restaurant.deliveryFee)} delivery`,
  ].join(' · ');

  // TODO: These fields might need to be added to the Restaurant type:
  // - distance: number (miles, calculated from user location)

  return (
    <>
      <View style={styles.bannerContainer}>
        <View style={styles.svgBackground}>
          <FoodItemsPlaceholder width="100%" height={400} />
        </View>
        <Image source={{ uri: restaurant?.imageUri || '' }} style={styles.banner} />

        <View style={styles.roundBackWrapper}>
          <Pressable onPress={onPressBack}>
            <View style={styles.roundBack}>
              <Icon name="ArrowLeftIcon" size={22} color={colors.brandYellow} weight="bold" />
            </View>
          </Pressable>
        </View>

        <View style={styles.addToCartWrapper}>
          <Pressable onPress={onPressStartGroupOrder}>
            <View style={styles.addToCart}>
              <Icon name="UsersThreeIcon" size={18} color={colors.brandYellow} weight="bold" />
              <Text numberOfLines={1} style={styles.buttonText}>Start group order</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={styles.header}>
        <Text size="heading2" weight="bolder" style={styles.restaurantName}>
          {restaurant?.name}
        </Text>

        <Text color="secondary" style={styles.detailText}>
          {firstDetailsRow}
        </Text>

        <Text color="secondary" style={styles.detailText}>
          {secondDetailsRow}
        </Text>

        <Pressable onPress={onPressInfo} style={styles.infoRow}>
          <Icon name="InfoIcon" size={24} color={colors.textSecondary} weight="regular" />
          <View style={styles.infoContent}>
            <Text weight="medium">Info</Text>
            <Text color="secondary" size="small" style={styles.infoSubtext}>
              Map, allergens and hygiene rating
            </Text>
          </View>
          <Icon name="CaretRightIcon" size={20} color={colors.brandYellow} weight="regular" />
        </Pressable>

        <Pressable onPress={onPressRating} style={styles.infoRow}>
          <Icon name="StarIcon" size={24} color={colors.success} weight="fill" />
          <View style={styles.infoContent}>
            <Text weight="medium">
              {restaurant.averageRating.toFixed(1)} Excellent ({restaurant.ratingCount}+)
            </Text>
          </View>
          <Icon name="CaretRightIcon" size={20} color={colors.brandYellow} weight="regular" />
        </Pressable>

        <Pressable onPress={onPressDeliveryTime} style={styles.infoRow}>
          <Icon name="BicycleIcon" size={24} color={colors.brandYellow} weight="regular" />
          <View style={styles.infoContent}>
            <Text weight="medium">
              Deliver in {deliveryTimeRange.minTime} - {deliveryTimeRange.maxTime} min
            </Text>
          </View>
          <Text weight='medium' color='brandColor'>Change</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  addToCart: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addToCartWrapper: {
    bottom: 12,
    position: 'absolute',
    right: 12,
    zIndex: 1,
  },
  banner: {
    height: 250,
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  bannerContainer: {
    position: 'relative',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailText: {
    fontSize: 14,
    marginTop: 6,
  },
  header: {
    backgroundColor: colors.background,
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 12,
  },
  infoSubtext: {
    marginTop: 2,
  },
  restaurantName: {
    fontSize: 20,
    lineHeight: 28,
  },
  roundBack: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  roundBackWrapper: {
    left: 12,
    position: 'absolute',
    top: 12,
    zIndex: 1,
  },
  svgBackground: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: -20,
    zIndex: 0,
  },
});
