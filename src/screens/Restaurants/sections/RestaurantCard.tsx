import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Icon, Text } from '@components';
import { useColors, useShadows } from '@theme';
import { Restaurant } from '@types';

type Props = {
  restaurant: Restaurant;
  onPress?: (restaurant: Restaurant) => void;
};

export default function RestaurantCard({ restaurant, onPress }: Props) {
  const colors = useColors();
  const shadows = useShadows();

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const formatRatingCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k+`;
    }
    return `${count}+`;
  };

  const formatDeliveryTime = (time?: number | null) => {
    if (!time) return 'N/A';
    return `${time} min`;
  };

  const formatDeliveryFee = (fee: number) => {
    return `රු${fee} Delivery Fee`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background }, shadows.card]}
      onPress={() => onPress?.(restaurant)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        {restaurant.imageUri ? (
          <Image source={{ uri: restaurant.imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.border }]}>
            <Icon name="StorefrontIcon" size={40} color={colors.textInactive} />
          </View>
        )}

        {/* Badge - Showing offers or featured */}
        <View style={[styles.badge, { backgroundColor: colors.success }]}>
          <Text size="small" weight="bold" color="primaryInverted">
            2 Offers available
          </Text>
        </View>

        {/* Favorite button */}
        <TouchableOpacity style={[styles.favoriteButton, shadows.card, { backgroundColor: colors.background }]} activeOpacity={0.7}>
          <Icon name="HeartIcon" size={20} color={colors.textPrimary} weight="regular" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text size="body" weight="bold" color="primary" numberOfLines={1} style={styles.name}>
          {restaurant.name}
        </Text>

        <View style={styles.detailsRow}>
          <Text size="small" color="secondary">
            {formatDeliveryFee(restaurant.deliveryFee)}
          </Text>
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.ratingContainer}>
            <Icon name="StarIcon" size={14} color={colors.brandPrimary} weight="fill" />
            <Text size="small" weight="medium" color="primary">
              {formatRating(restaurant.averageRating)}
            </Text>
            <Text size="small" color="secondary">
              ({formatRatingCount(restaurant.ratingCount)})
            </Text>
          </View>
          <Text size="small" color="secondary">
            {formatDeliveryTime(restaurant.deliveryTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 4,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: 'absolute',
    top: 8,
  },
  container: {
    borderRadius: 12,
    marginRight: 16,
    width: 280,
  },
  content: {
    padding: 12,
  },
  detailsRow: {
    marginTop: 4,
  },
  favoriteButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 8,
    top: 8,
    width: 36,
  },
  image: {
    borderRadius: 12,
    height: 180,
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
  },
  imagePlaceholder: {
    alignItems: 'center',
    borderRadius: 12,
    height: 180,
    justifyContent: 'center',
    width: '100%',
  },
  name: {
    marginBottom: 4,
  },
  ratingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

