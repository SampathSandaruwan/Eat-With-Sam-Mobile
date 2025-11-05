import React, { useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  Text,
  TopNavBar,
} from '@components';
import { useCartModal } from '@contexts';
import { useRestaurants } from '@hooks';
import { useCartStore } from '@store';
import { colors, TOP_NAV_HEIGHT } from '@theme';
import { Restaurant } from '@types';

import {
  CategoryIcons,
  DeliveryInfoBar,
  FilterButtons,
  RestaurantSection,
  SearchBar,
} from './sections';

import type { RootStackParams } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

export default function RestaurantsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { openCart } = useCartModal();
  const cartItems = useCartStore((state) => state.items);
  const { data: restaurants, isLoading: isLoadingRestaurants } = useRestaurants();

  const handleRestaurantPress = (restaurantId: number) => {
    navigation.navigate('Menu', { restaurantId });
  };

  // Split restaurants into featured and recommended sections
  const { featuredRestaurants, recommendedRestaurants } = useMemo(() => {
    let _featuredRestaurants: Restaurant[] = [];
    let _recommendedRestaurants: Restaurant[] = [];

    if (!restaurants) return {
      featuredRestaurants: _featuredRestaurants,
      recommendedRestaurants: _recommendedRestaurants,
    };

    const sortedRestaurants = restaurants.sort((a, b) => b.averageRating - a.averageRating);
    _featuredRestaurants = sortedRestaurants.slice(0, 5);
    _recommendedRestaurants = sortedRestaurants.slice(5);

    return {
      featuredRestaurants: _featuredRestaurants,
      recommendedRestaurants: _recommendedRestaurants };
  }, [restaurants]);

  return (
    <View style={styles.container}>
      {/* The Top most navigation bar */}
      <TopNavBar />

      {isLoadingRestaurants ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brandPrimary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchBar placeholder="Search Deliveroo" />
          </View>

          {/* Delivery Information Bar */}
          <DeliveryInfoBar
            deliveryAddress="Pokunuwatta Road"
            cartItemCount={cartItems.length}
            onCartPress={openCart}
          />

          {/* Category Icons */}
          <CategoryIcons />

          {/* Filter Buttons */}
          <FilterButtons />

          {/* Additional fees info */}
          <View style={styles.infoTextContainer}>
            <Text size="small" color="secondary">
              Additional fees may apply.{' '}
              <Text size="small" color="brandColor" weight="medium">
                Learn more
              </Text>
            </Text>
          </View>

          {/* Featured Restaurants Section */}
          {featuredRestaurants.length > 0 && (
            <RestaurantSection
              title="Featured on Deliveroo"
              restaurants={featuredRestaurants}
              onRestaurantPress={(restaurant) => handleRestaurantPress(restaurant.id)}
            />
          )}

          {/* Recommended Restaurants Section */}
          {recommendedRestaurants.length > 0 && (
            <RestaurantSection
              title="Places you might like"
              restaurants={recommendedRestaurants}
              onRestaurantPress={(restaurant) => handleRestaurantPress(restaurant.id)}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  infoTextContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: TOP_NAV_HEIGHT,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  scrollView: {
    flex: 1,
    paddingTop: TOP_NAV_HEIGHT,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
