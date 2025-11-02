import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ListRenderItem,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { FloatingActionButton, Icon } from '@components';
import { useMenuCategories, useMenuItem, useMenuItems, useRestaurant } from '@hooks';
import { colors, TOP_NAV_HEIGHT } from '@theme';
import { MenuItem } from '@types';

import { useCartStore } from '../../store';
import CartScreen from '../Cart';
import { CategoryTabs, MenuItemCard, RestaurantInfo, SelectedMenuItem, TopNavBar } from './components';

const TOP_NAV_HEIGHT_WITH_PADDING = TOP_NAV_HEIGHT;

type Props = {
  restaurantId: number;
}

export default function MenuScreen({ restaurantId }: Props) {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>();
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<number | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [restaurantInfoHeight, setRestaurantInfoHeight] = useState(0);
  const scrollYRef = useRef(new Animated.Value(0));
  const scrollY = scrollYRef.current;

  const { data: restaurant, isLoading: isLoadingRestaurant } = useRestaurant(restaurantId);
  const { data: menuCategories } = useMenuCategories(restaurantId);
  const { data: menuItems } = useMenuItems(activeCategoryId ?? null);
  const { data: selectedMenuItem, isLoading: isLoadingSelectedItem } = useMenuItem(selectedMenuItemId);

  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  useEffect(() => {
    if (menuCategories) {
      setActiveCategoryId(menuCategories[0]?.id ?? null);
    }
  }, [menuCategories]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setTimeout(() => {
        setShowCart(false);
      }, 800);
    }
  }, [cartItems]);

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
    <View style={styles.safe}>
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
                  onPressStartGroupOrder={() => setShowCart(true)}
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
        contentContainerStyle={[styles.listContent, { paddingTop: TOP_NAV_HEIGHT }]}
      />

      {/* Floating Cart Button */}
      {cartItems.length > 0 && (
        <View style={styles.cartButtonContainer}>
          <FloatingActionButton onPress={() => setShowCart(true)} />
        </View>
      )}

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

      {/* View-Cart Modal */}
      <Modal
        visible={showCart}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCart(false)}
      >
        <View style={styles.cartModalContainer}>
          <View style={styles.cartModalHeader}>
            <TouchableOpacity
              onPress={() => setShowCart(false)}
              style={styles.cartModalCloseButton}
            >
              <Icon name="ArrowLeftIcon" size={24} color={colors.textPrimary} weight="bold" />
            </TouchableOpacity>
          </View>
          <CartScreen />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cartButtonContainer: {
    bottom: 24,
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
  cartModalCloseButton: {
    padding: 8,
  },
  cartModalContainer: {
    backgroundColor: colors.background,
    flex: 1,
  },
  cartModalHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
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
  safe: {
    backgroundColor: colors.background,
    flex: 1,
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

