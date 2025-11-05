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
  useMenuCategoriesWithDishes,
  useDish,
  useRestaurant,
  useTopTenDiscountedDishes,
  useTopTenRatedDishes,
} from '@hooks';
import { useCartStore } from '@store';
import {
  CATEGORY_WISE_MENU_ITEM_CARD_HEIGHT,
  CATEGORY_WISE_MENU_ITEM_CARD_MARGIN_VERTICAL,
  TOP_CATEGORY_HEADER_HEIGHT,
  TOP_NAV_HEIGHT,
  useColors,
} from '@theme';
import { MenuCategory, Dish } from '@types';

import {
  CategoryTabs,
  CategoryTabsRef,
  CategoryWiseMenuItemCard,
  DiscountedMenuItemCard,
  RestaurantInfo,
  SelectedMenuItem,
  TopRatedMenuItemCard,
} from './sections';

import type { RootStackParams } from '../../navigation/types';

export const CATEGORY_WISE_MENU_ITEM_CARD_MARGIN = CATEGORY_WISE_MENU_ITEM_CARD_MARGIN_VERTICAL * 2;
export const CATEGORY_WISE_MENU_ITEM_CARD_TOTAL_HEIGHT = CATEGORY_WISE_MENU_ITEM_CARD_HEIGHT + CATEGORY_WISE_MENU_ITEM_CARD_MARGIN;

export const CATEGORY_HEADER_PADDING_BOTTOM = 16;
export const CATEGORY_HEADER_TEXT_MARGIN_BOTTOM = 4;
export const CATEGORY_HEADER_TEXT_FONT_SIZE = 16;
export const CATEGORY_HEADER_TEXT_LINE_HEIGHT = CATEGORY_HEADER_TEXT_FONT_SIZE * 1.5;
export const CATEGORY_HEADER_HEIGHT = CATEGORY_HEADER_TEXT_LINE_HEIGHT + CATEGORY_HEADER_PADDING_BOTTOM + CATEGORY_HEADER_TEXT_MARGIN_BOTTOM;

export const CATEGORY_SECTION_MARGIN_VERTICAL = 8;
export const CATEGORY_SECTION_MARGIN = CATEGORY_SECTION_MARGIN_VERTICAL * 2;


type MenuScreenRouteProp = RouteProp<RootStackParams, 'Menu'>;

type ListItemType = {
  [key: string]: Dish[];
}

export default function MenuScreen() {
  const route = useRoute<MenuScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  const colors = useColors();

  const { restaurantId } = route.params;
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [selectedDishId, setSelectedDishId] = useState<number | null>(null);
  const [restaurantInfoHeight, setRestaurantInfoHeight] = useState(0);
  const [listHeaderHeight, setListHeaderHeight] = useState(0);
  const scrollYRef = useRef(new Animated.Value(0));
  const scrollY = scrollYRef.current;
  const flatListRef = useRef<FlatList>(null);
  const categoryTabsRef = useRef<CategoryTabsRef>(null);
  const categorySectionOffsets = useRef<Map<number, number>>(new Map());
  const categorySectionHeights = useRef<Map<number, number>>(new Map());
  const isScrollingToCategory = useRef(false);

  const { data: restaurant, isLoading: isLoadingRestaurant } = useRestaurant(restaurantId);
  const { data: menuCategories, isLoading: isLoadingCategories } = useMenuCategories(restaurantId);
  const { data: categoriesWithItems, isLoading: isLoadingAllItems } = useMenuCategoriesWithDishes(restaurantId);
  const { data: topTenRatedDishes } = useTopTenRatedDishes();
  const { data: topTenDiscountedDishes } = useTopTenDiscountedDishes();
  const { data: selectedDish, isLoading: isLoadingSelectedDish } = useDish(selectedDishId);

  const addItem = useCartStore((state) => state.addItem);

  // Build flat list data with category sections
  // Group items into rows of 2 for grid layout
  const listData: ListItemType = React.useMemo(() => {
    const data: ListItemType = {};

    for (const category of categoriesWithItems ?? []) {
      data[category.id] = category.dishes ?? [];
    }

    return data;
  }, [categoriesWithItems]);

  const handleItemPress = (item: Dish) => {
    setSelectedDishId(item.id);
  };

  const addDishToCart = (quantity: number) => {
    if (selectedDish) {
      addItem(selectedDish, quantity);
      setSelectedDishId(null);
    }
  };

  const calculateCategoryOffset = useCallback((categoryId: number): number | undefined => {
    if (!menuCategories) return undefined;

    const categoryIndex = menuCategories.findIndex((cat) => cat.id === categoryId);
    if (categoryIndex === -1) return undefined;

    let offset = listHeaderHeight;

    for (let i = 0; i < categoryIndex; i++) {
      const prevCategory = menuCategories[i];
      if (prevCategory) {
        const measuredHeight = categorySectionHeights.current.get(prevCategory.id);

        if (measuredHeight !== undefined) {
          offset += measuredHeight + CATEGORY_SECTION_MARGIN;
        } else {
          // Use estimated height based on layout constants in incremental rendering
          const itemCount = listData[prevCategory.id]?.length ?? 0;
          const estimatedHeight =
            CATEGORY_HEADER_HEIGHT +
            (itemCount * CATEGORY_WISE_MENU_ITEM_CARD_TOTAL_HEIGHT) +
            CATEGORY_SECTION_MARGIN;
          offset += estimatedHeight;
        }
      }
    }

    return offset;
  }, [menuCategories, listData, listHeaderHeight]);

  const recalculateCategoryOffsets = useCallback(() => {
    if (!menuCategories) return;

    menuCategories.forEach((category) => {
      const offset = calculateCategoryOffset(category.id);
      if (offset !== undefined) {
        categorySectionOffsets.current.set(category.id, offset);
      }
    });
  }, [menuCategories, calculateCategoryOffset]);

  useEffect(() => {
    if (listHeaderHeight > 0) {
      recalculateCategoryOffsets();
    }
  }, [listHeaderHeight, recalculateCategoryOffsets]);

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
      if (!isScrollingToCategory.current) {
        categoryTabsRef.current?.scrollToCategory(activeCategory);
      }
    }
  }, [activeCategoryId]);

  const renderCategoryWiseItem: ListRenderItem<MenuCategory> = ({ item }) => {
    return (
      <View
        style={styles.categorySectionContainer}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          categorySectionHeights.current.set(item.id, height);
          recalculateCategoryOffsets();
        }}
      >
        <View style={styles.categoryHeaderContainer}>
          <Text weight="semiBold" size="heading1" style={styles.categoryHeaderText}>
            {item.name}
          </Text>
        </View>

        {listData[item.id]?.map((dish) => (
          <CategoryWiseMenuItemCard key={dish.id} item={dish} onPress={handleItemPress} />
        ))}
      </View>
    );
  };

  const getItemLayout = useCallback(
    (data: ArrayLike<MenuCategory> | null | undefined, index: number) => {
      if (!data || !data[index]) {
        return { length: 200, offset: 0, index };
      }

      let offset = listHeaderHeight;

      if (data) {
        for (let i = 0; i < index; i++) {
          const prevItem = data[i];
          if (prevItem) {
            // Try to use measured height if available, otherwise calculate estimated height
            const measuredHeight = categorySectionHeights.current.get(prevItem.id);

            if (measuredHeight !== undefined) {
              offset += measuredHeight + CATEGORY_SECTION_MARGIN;
            } else {
              // Calculate estimated height based on number of menu items
              const itemCount = listData[prevItem.id]?.length ?? 0;
              const estimatedHeight =
                CATEGORY_HEADER_HEIGHT +
                (itemCount * CATEGORY_WISE_MENU_ITEM_CARD_TOTAL_HEIGHT) +
                CATEGORY_SECTION_MARGIN;
              offset += estimatedHeight + CATEGORY_SECTION_MARGIN;
            }
          }
        }
      }

      const currentItem = data[index];
      const measuredHeight = categorySectionHeights.current.get(currentItem.id);
      let length: number;

      if (measuredHeight !== undefined) {
        length = measuredHeight;
      } else {
        const itemCount = listData[currentItem.id]?.length ?? 0;
        length =
          CATEGORY_HEADER_HEIGHT +
          (itemCount * CATEGORY_WISE_MENU_ITEM_CARD_TOTAL_HEIGHT) +
          CATEGORY_SECTION_MARGIN;
      }

      return { length, offset, index };
    },
    [listData, listHeaderHeight],
  );

  const renderDiscountedItem: ListRenderItem<Dish> = ({ item }) => (
    <View style={styles.discountedItemsGrid}>
      <DiscountedMenuItemCard item={item} onPress={handleItemPress} />
    </View>
  );

  const renderTopTenRatedItem: ListRenderItem<Dish> = ({ item }) => (
    <View style={styles.topTenRatedItemsGrid}>
      <TopRatedMenuItemCard item={item} onPress={handleItemPress} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* The Top most navigation bar */}
      <TopNavBar />

      {/* The category tabs that are sticky to the top of the header  on scroll */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.stickyTabsContainer,
          { borderColor: colors.border },
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
        <View style={[styles.tabsWrapper, { borderColor: colors.border }]}>
          <CategoryTabs
            ref={categoryTabsRef}
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
        getItemLayout={getItemLayout}
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
            <View
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setListHeaderHeight(height - TOP_CATEGORY_HEADER_HEIGHT - CATEGORY_HEADER_PADDING_BOTTOM + CATEGORY_HEADER_TEXT_MARGIN_BOTTOM);
              }}
            >
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
                  ref={categoryTabsRef}
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
                  data={topTenDiscountedDishes}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderDiscountedItem}
                  horizontal
                />
              </View>

              <View>
                <Text weight="semiBold" size="heading1" style={styles.topRatedItemsText}>Popular with other people</Text>
                <FlatList
                  data={topTenRatedDishes}
                  keyExtractor={item => item.id.toString()}
                  renderItem={renderTopTenRatedItem}
                  horizontal
                />
              </View>
            </View>
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

      {/* Selected Dish Detail Modal */}
      <SelectedMenuItem
        isLoadingSelectedItem={isLoadingSelectedDish}
        selectedMenuItem={selectedDish}
        visible={selectedDishId !== null}
        onPressClose={() => setSelectedDishId(null)}
        onPressAddToCart={addDishToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoryHeaderContainer: {
    paddingBottom: CATEGORY_HEADER_PADDING_BOTTOM,
  },
  categoryHeaderText: {
    marginBottom: CATEGORY_HEADER_TEXT_MARGIN_BOTTOM,
  },
  categorySectionContainer: {
    marginVertical: CATEGORY_SECTION_MARGIN_VERTICAL,
  },
  container: {
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
    borderTopWidth: 1,
    left: 0,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 0,
    top: TOP_NAV_HEIGHT,
    zIndex: 9,
  },
  tabsWrapper: {
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

