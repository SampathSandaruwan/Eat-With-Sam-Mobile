import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ListRenderItem,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import { NavigationProp, type RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { Text, TopNavBar } from '@components';
import { useMenuCategories, useMenuItem, useMenuItems, useRestaurant } from '@hooks';
import { useCartStore } from '@store';
import { colors, TOP_NAV_HEIGHT } from '@theme';
import { MenuItem } from '@types';

import { CategoryTabs, MenuItemCard, RestaurantInfo, SelectedMenuItem } from './sections';

import type { RootStackParams } from '../../navigation/types';

const TOP_NAV_HEIGHT_WITH_PADDING = TOP_NAV_HEIGHT;

type MenuScreenRouteProp = RouteProp<RootStackParams, 'Menu'>;

export default function MenuScreen() {
  const route = useRoute<MenuScreenRouteProp>();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  const { restaurantId } = route.params;
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>();
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<number | null>(null);
  const [restaurantInfoHeight, setRestaurantInfoHeight] = useState(0);
  const scrollYRef = useRef(new Animated.Value(0));
  const scrollY = scrollYRef.current;

  const { data: restaurant, isLoading: isLoadingRestaurant } = useRestaurant(restaurantId);
  const { data: menuCategories, isLoading: isLoadingCategories } = useMenuCategories(restaurantId);
  const { data: menuItems, isLoading: isLoadingMenuItems } = useMenuItems(activeCategoryId ?? null);
  const { data: selectedMenuItem, isLoading: isLoadingSelectedItem } = useMenuItem(selectedMenuItemId);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (menuCategories) {
      setActiveCategoryId(menuCategories[0]?.id ?? null);
    }
  }, [menuCategories]);

  const handleItemPress = (item: MenuItem) => {
    setSelectedMenuItemId(item.id);
  };

  const addMenuItemToCart = (quantity: number) => {
    if (selectedMenuItem) {
      addItem(selectedMenuItem, quantity);
      setTimeout(() => {
        setSelectedMenuItemId(null);
      }, 800);
    }
  };

  const renderItem: ListRenderItem<MenuItem> = ({ item }) => (
    <View style={styles.gridItem}>
      <MenuItemCard item={item} onPress={handleItemPress} />
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
            onChange={(id) => setActiveCategoryId(Number(id))}
          />
        </View>
      </Animated.View>

      {/* The list of menu items */}
      <Animated.FlatList
        data={menuItems}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.grid}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        ListHeaderComponent={
          isLoadingRestaurant || !restaurant ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brandYellow} />
            </View>
          ) : (
            <View style={styles.restaurantInfoContainer}>
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

              <View style={[styles.tabsWrapper, styles.tabsWrapperBorders]}>
                <CategoryTabs
                  categories={menuCategories ?? []}
                  activeCategoryId={activeCategoryId}
                  onChange={(id) => setActiveCategoryId(Number(id))}
                />
              </View>
            </View>
          )
        }
        ListEmptyComponent={
          isLoadingMenuItems || isLoadingCategories ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={colors.brandYellow} />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text color="secondary">No menu items available in this category</Text>
            </View>
          )
        }
        contentContainerStyle={[styles.listContent, { paddingTop: TOP_NAV_HEIGHT }]}
      />

      {/* Selected Menu Item Detail Modal */}
      <Modal
        visible={selectedMenuItemId !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedMenuItemId(null)}
      >
        {selectedMenuItem && (
          <SelectedMenuItem
            isLoadingSelectedItem={isLoadingSelectedItem}
            selectedMenuItem={selectedMenuItem}
            onPressClose={() => setSelectedMenuItemId(null)}
            onPressAddToCart={addMenuItemToCart}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 200,
    paddingVertical: 48,
  },
  grid: {
    gap: 12,
  },
  gridItem: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  restaurantInfoContainer: {
    marginBottom: 8,
  },
  stickyTabsContainer: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 1,
    left: 0,
    paddingHorizontal: 12,
    position: 'absolute',
    right: 0,
    top: TOP_NAV_HEIGHT_WITH_PADDING,
    zIndex: 9,
  },
  tabsWrapper: {
    backgroundColor: colors.background,
  },
  tabsWrapperBorders: {
    borderBottomWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 1,
    marginHorizontal: -12,
    paddingHorizontal: 12,
  },
});

