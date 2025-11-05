import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import {
  NavigationProp,
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import { Text, TopNavBar } from '@components';
import { PROMOTIONAL_TEXT } from '@constants';
import {
  useMenuCategories,
  useMenuCategoriesWithItems,
  useMenuItem,
  useRestaurant,
  useTopTenDiscountedMenuItems,
  useTopTenRatedMenuItems,
} from '@hooks';
import { useCartStore } from '@store';
import { colors, TOP_NAV_HEIGHT } from '@theme';
import { MenuCategory, MenuItem } from '@types';

import {
  CategoryTabs,
  CategoryWiseMenuItemCard,
  DiscountedMenuItemCard,
  RestaurantInfo,
  SelectedMenuItem,
  TopRatedMenuItemCard,
} from './sections';

import type { RootStackParams } from '../../navigation/types';


type MenuScreenRouteProp = RouteProp<RootStackParams, 'Menu'>;

type ListItemType = {
  [key: string]: MenuItem[];
}

export default function MenuScreen() {
  const route = useRoute<MenuScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { restaurantId } = route.params;
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<number | null>(null);
  const [restaurantInfoHeight, setRestaurantInfoHeight] = useState(0);
  const scrollYRef = useRef(new Animated.Value(0));
  const scrollY = scrollYRef.current;
  const flatListRef = useRef<FlatList>(null);
  const categorySectionOffsets = useRef<Map<number, number>>(new Map());
  const isScrollingToCategory = useRef(false);

  const { data: restaurant, isLoading: isLoadingRestaurant } = useRestaurant(restaurantId);
  const { data: menuCategories, isLoading: isLoadingCategories } = useMenuCategories(restaurantId);
  const { data: categoriesWithItems, isLoading: isLoadingAllItems } = useMenuCategoriesWithItems(restaurantId);
  const { data: topTenRatedMenuItems } = useTopTenRatedMenuItems();
  const { data: topTenDiscountedMenuItems } = useTopTenDiscountedMenuItems();
  const { data: selectedMenuItem, isLoading: isLoadingSelectedItem } = useMenuItem(selectedMenuItemId);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (menuCategories && menuCategories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(menuCategories[0]?.id ?? null);
    }
  }, [menuCategories, activeCategoryId]);

  // Build flat list data with category sections
  // Group items into rows of 2 for grid layout
  const listData: ListItemType = React.useMemo(() => {
    const data: ListItemType = {};

    for (const category of categoriesWithItems ?? []) {
      data[category.id] = category.menuItems ?? [];
    }

    return data;
  }, [categoriesWithItems]);

  const handleItemPress = (item: MenuItem) => {
    setSelectedMenuItemId(item.id);
  };

  const addMenuItemToCart = (quantity: number) => {
    if (selectedMenuItem) {
      addItem(selectedMenuItem, quantity);
      setSelectedMenuItemId(null);
    }
  };

  const handleCategoryTabPress = useCallback((categoryId: number) => {
    const offset = categorySectionOffsets.current.get(categoryId);
    if (offset !== undefined && flatListRef.current) {
      isScrollingToCategory.current = true;
      flatListRef.current.scrollToOffset({ offset, animated: true });
      setActiveCategoryId(categoryId);
      setTimeout(() => {
        isScrollingToCategory.current = false;
      }, 500);
    }
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isScrollingToCategory.current) return;

    const scrollYValue = event.nativeEvent.contentOffset.y;
    const threshold = 100; // Offset threshold for considering a section active

    // Find which category section is currently visible
    // We want the category whose header is closest to but above the current scroll position
    let activeCategory: number | null = null;
    let maxOffsetBelowScroll = -Infinity;

    categorySectionOffsets.current.forEach((offset, categoryId) => {
      // If the section header is above or near the current scroll position (with threshold)
      if (offset <= scrollYValue + threshold) {
        if (offset > maxOffsetBelowScroll) {
          maxOffsetBelowScroll = offset;
          activeCategory = categoryId;
        }
      }
    });

    if (activeCategory !== null && activeCategory !== activeCategoryId) {
      setActiveCategoryId(activeCategory);
    }
  }, [activeCategoryId]);

  const renderCategoryWiseItem: ListRenderItem<MenuCategory> = ({ item }) => {
    return (
      <View style={styles.categorySectionContainer}>
        <View
          style={styles.categoryHeaderContainer}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            // y is the position relative to the FlatList content container
            // This is the offset we need for scrollToOffset
            categorySectionOffsets.current.set(item.id, y);
          }}
        >
          <Text weight="semiBold" size="heading1" style={styles.categoryHeaderText}>
            {item.name}
          </Text>
        </View>

        {listData[item.id]?.map((menuItem) => (
          <CategoryWiseMenuItemCard key={menuItem.id} item={menuItem} onPress={handleItemPress} />
        ))}
      </View>
    );
  };

  // const getItemLayout = useCallback(
  //   (data: ArrayLike<ListItemType> | null | undefined, index: number) => {
  //     if (!data || !data[index]) {
  //       return { length: 200, offset: 0, index };
  //     }

  //     // Calculate cumulative height up to this index
  //     let offset = 0;
  //     if (data) {
  //       for (let i = 0; i < index; i++) {
  //         const prevItem = data[i];
  //         if (prevItem) {
  //           if (prevItem.type === 'category-header') {
  //             offset += 60; // Header height
  //           } else {
  //             offset += 200; // Row height
  //           }
  //         }
  //       }
  //     }

  //     const item = data?.[index];
  //     if (item.type === 'category-header') {
  //       return { length: 60, offset, index };
  //     }

  //     // For category rows, estimate height
  //     return { length: 200, offset, index };
  //   },
  //   [],
  // );

  const renderDiscountedItem: ListRenderItem<MenuItem> = ({ item }) => (
    <View style={styles.discountedItemsGrid}>
      <DiscountedMenuItemCard item={item} onPress={handleItemPress} />
    </View>
  );

  const renderTopTenRatedItem: ListRenderItem<MenuItem> = ({ item }) => (
    <View style={styles.topTenRatedItemsGrid}>
      <TopRatedMenuItemCard item={item} onPress={handleItemPress} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* The Top most navigation bar */}
      <TopNavBar />

      {/* The category tabs that are sticky to the top of the header  on scroll */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.stickyTabsContainer,
          {
            opacity: scrollY.interpolate({
              inputRange: [
                Math.max(0, restaurantInfoHeight - 1),
                restaurantInfoHeight,
              ],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        <View style={styles.tabsWrapper}>
          <CategoryTabs
            categories={menuCategories ?? []}
            activeCategoryId={activeCategoryId}
            onChange={handleCategoryTabPress}
          />
        </View>
      </Animated.View>

      {/* The list of menu items */}
      <Animated.FlatList
        ref={flatListRef}
        data={menuCategories}
        keyExtractor={(item: MenuCategory) => `category-header-${item.id}`}
        renderItem={renderCategoryWiseItem}
        // getItemLayout={getItemLayout}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: handleScroll,
          },
        )}
        ListHeaderComponent={
          isLoadingRestaurant || !restaurant ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brandPrimary} />
            </View>
          ) : (
            <>
              <View
                onLayout={(event) => {
                  const { height } = event.nativeEvent.layout;
                  setRestaurantInfoHeight(height);
                }}
              >
                <RestaurantInfo
                  restaurant={restaurant}
                  onPressStartGroupOrder={() => {
                    // TODO: Implement group order functionality
                  }}
                  onPressBack={() => navigation.goBack()}
                />
              </View>

              <View style={styles.tabsWrapper}>
                <CategoryTabs
                  categories={menuCategories ?? []}
                  activeCategoryId={activeCategoryId}
                  onChange={handleCategoryTabPress}
                />
              </View>

              <View style={styles.restaurantCaption}>
                <Text color="secondary">{restaurant.description}</Text>
              </View>

              <View style={styles.discountedItemsContainer}>
                <Text weight="semiBold" size="heading1" style={styles.discountedItemsText}>{PROMOTIONAL_TEXT.DISCOUNTED_ITEMS_TITLE}</Text>
                <Text color="secondary" style={styles.discountedItemsText}>{PROMOTIONAL_TEXT.DISCOUNTED_ITEMS_DESCRIPTION}</Text>
                <FlatList
                  data={topTenDiscountedMenuItems}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderDiscountedItem}
                  horizontal
                />
              </View>

              <View>
                <Text weight="semiBold" size="heading1" style={styles.topRatedItemsText}>Popular with other people</Text>
                <FlatList
                  data={topTenRatedMenuItems}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderTopTenRatedItem}
                  horizontal
                />
              </View>
            </>
          )
        }
        ListEmptyComponent={
          isLoadingAllItems || isLoadingCategories ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={colors.brandPrimary} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text color="secondary">No menu items available</Text>
            </View>
          )
        }
        contentContainerStyle={[styles.listContent, { paddingTop: TOP_NAV_HEIGHT }]}
      />

      {/* Selected Menu Item Detail Modal */}
      <SelectedMenuItem
        isLoadingSelectedItem={isLoadingSelectedItem}
        selectedMenuItem={selectedMenuItem}
        visible={selectedMenuItemId !== null}
        onPressClose={() => setSelectedMenuItemId(null)}
        onPressAddToCart={addMenuItemToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryHeaderContainer: {
    paddingBottom: 16,
  },
  categoryHeaderText: {
    marginBottom: 4,
  },
  categorySectionContainer: {
    marginVertical: 8,
  },
  container: {
    backgroundColor: colors.backgroundSecondary,
    flex: 1,
  },
  discountedItemsContainer: {
    marginBottom: 8,
  },
  discountedItemsGrid: {
    marginBottom: 8,
    marginRight: 12,
    marginTop: 4,
  },
  discountedItemsText: {
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 200,
    paddingVertical: 48,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  restaurantCaption: {
    paddingVertical: 16,
  },
  stickyTabsContainer: {
    borderColor: colors.border,
    borderTopWidth: 1,
    left: 0,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 0,
    top: TOP_NAV_HEIGHT,
    zIndex: 9,
  },
  tabsWrapper: {
    borderColor: colors.border,
    borderTopWidth: 1,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  topRatedItemsText: {
    marginBottom: 12,
  },
  topTenRatedItemsGrid: {
    marginBottom: 8,
    marginRight: 12,
    marginTop: 4,
  },
});

