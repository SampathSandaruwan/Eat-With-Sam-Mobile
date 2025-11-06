import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Icon, Text } from '@components';
import { SCREEN_WIDTH, useColors } from '@theme';
import { Restaurant } from '@types';
import { calculateDeliveryTime, formatCurrency } from '@utils';

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

  const colors = useColors();

  // Concatenate details at JS level for natural line breaking
  const firstDetailsRow = [
    `${deliveryTimeRange.minTime} - ${deliveryTimeRange.maxTime} min`,
    restaurant.cuisineType,
  ]
    .filter(Boolean)
    .join(' · ');

  const secondDetailsRow = [
    // TODO: These fields might need to be added to the Restaurant type:
    // - distance: number (miles, calculated from user location)
    '0.2 miles away',
    'Closes at 22:00',
    `${formatCurrency(restaurant.minimumOrder)} minimum`,
    `${formatCurrency(restaurant.deliveryFee)} delivery`,
  ].join(' · ');


  return (
    <>
      <View style={styles.bannerContainer}>
        <View style={styles.svgBackground}>
          <FoodItemsPlaceholder width="100%" height={400} />
        </View>
        <Image source={{ uri: restaurant?.imageUri || '' }} style={styles.bannerImage} />

        <View style={styles.roundBackWrapper}>
          <Pressable onPress={onPressBack}>
            <View style={[styles.roundBack, { backgroundColor: colors.background }]}>
              <Icon name="ArrowLeftIcon" size={20} color={colors.brandPrimary} weight="bold" />
            </View>
          </Pressable>
        </View>

        <View style={styles.startGroupOrderWrapper}>
          <Pressable onPress={onPressStartGroupOrder}>
            <View style={[styles.startGroupOrder, { backgroundColor: colors.background }]}>
              <Icon name="UsersIcon" size={16} color={colors.brandPrimary} weight="bold" />
              <Text weight='regular'>Start group order</Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text size="veryLarge" weight="bold" style={styles.restaurantName}>
          {restaurant?.name}
        </Text>

        <Text color="secondary" style={styles.detailText}>
          {firstDetailsRow}
        </Text>

        <Text color="secondary" style={styles.detailText}>
          {secondDetailsRow}
        </Text>

        <Pressable onPress={onPressInfo} style={styles.infoRow}>
          <Icon name="InfoIcon" size={22} color={colors.textSecondary} weight="regular" />
          <View style={styles.infoContent}>
            <Text weight="regular">Info</Text>
            <Text color="secondary" size="small" style={styles.infoSubtext}>
              Map, allergens and hygiene rating
            </Text>
          </View>
          <Icon name="CaretRightIcon" size={20} color={colors.brandPrimary} weight="regular" />
        </Pressable>

        <Pressable onPress={onPressRating} style={styles.infoRow}>
          <Icon name="StarIcon" size={22} color={colors.success} weight="fill" />
          <View style={styles.infoContent}>
            <View style={styles.ratingTextContainer}>
              <Text weight="regular" color="success">
                {restaurant.averageRating.toFixed(1)} Excellent
              </Text>
              <Text weight="regular">
                ({restaurant.ratingCount}+)
              </Text>
            </View>
            <View style={[styles.infoSubtext,styles.ratingCommentContainer, { backgroundColor: colors.successLight }]}>
              <Icon name="SmileyIcon" size={16} color={colors.success} weight="regular" />
              <Text color="success">
                &apos;Tasty food&apos;
              </Text>
            </View>
          </View>
          <Icon name="CaretRightIcon" size={20} color={colors.brandPrimary} weight="regular" />
        </Pressable>

        <Pressable onPress={onPressDeliveryTime} style={styles.infoRow}>
          <Icon name="BicycleIcon" size={22} color={colors.brandPrimary} weight="regular" />
          <View style={styles.infoContent}>
            <Text weight="regular">
              Deliver in {deliveryTimeRange.minTime} - {deliveryTimeRange.maxTime} min
            </Text>
          </View>
          <Text weight='regular' color='brandColor'>Change</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'relative',
  },
  bannerImage: {
    height: 240,
    marginHorizontal: -16,
    position: 'relative',
    width: SCREEN_WIDTH,
    zIndex: 1,
  },
  detailText: {
    marginTop: 4,
  },
  header: {
    marginHorizontal: -16,
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
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
  ratingCommentContainer: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 3,
    flexDirection: 'row',
    gap: 2,
  },
  ratingTextContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  restaurantName: {
    lineHeight: 28,
  },
  roundBack: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  roundBackWrapper: {
    left: -8,
    position: 'absolute',
    top: 12,
    zIndex: 1,
  },
  startGroupOrder: {
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 8,
    height: 40,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  startGroupOrderWrapper: {
    bottom: 12,
    position: 'absolute',
    right: 0,
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
