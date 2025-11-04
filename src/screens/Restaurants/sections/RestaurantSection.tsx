import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Icon, Text } from '@components';
import { colors } from '@theme';
import { Restaurant } from '@types';

import RestaurantCard from './RestaurantCard';

type Props = {
  title: string;
  restaurants: Restaurant[];
  onRestaurantPress?: (restaurant: Restaurant) => void;
  onSeeAllPress?: () => void;
};

export default function RestaurantSection({
  title,
  restaurants,
  onRestaurantPress,
  onSeeAllPress,
}: Props) {
  if (restaurants.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text size="heading2" weight="bold" color="primary">
          {title}
        </Text>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
            <Icon name="CaretRightIcon" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={onRestaurantPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingLeft: 16,
  },
  scrollView: {
    flexGrow: 0,
  },
});

