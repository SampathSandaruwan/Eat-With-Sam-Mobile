import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, Text } from '@components';
import { DELIVERY_ADDRESS } from '@constants';
import { usePlaceOrder, useRestaurant, useTopTenRatedDishes } from '@hooks';
import { useAuthStore, useCartStore } from '@store';
import { useColors, useShadows } from '@theme';
import { CartItem, Dish, PlaceOrderRequestBody } from '@types';
import { formatCurrency } from '@utils';

import { TopRatedMenuItemCard } from './Sections';

type Props = {
  visible: boolean;
  onClose: () => void;
}

export default function CartModal({ visible, onClose }: Props) {
  const [riderTip, setRiderTip] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const colors = useColors();
  const shadows = useShadows();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getCartSummary = useCartStore((state) => state.getCartSummary);
  const addItem = useCartStore((state) => state.addItem);

  const { isAuthenticated } = useAuthStore();
  const placeOrderMutation = usePlaceOrder();

  const { data: topTenRatedDishes } = useTopTenRatedDishes();

  const thingsMorePossibleToAdd = useMemo(() => {
    return topTenRatedDishes?.filter((item) => !items.some((cartItem) => cartItem.dish.id === item.id));
  }, [items, topTenRatedDishes]);

  // Get restaurant ID from first cart item
  const restaurantId = items.length > 0 ? items[0].dish.restaurantId : null;
  const { data: restaurant } = useRestaurant(restaurantId);

  // Use restaurant's deliveryFee, taxRate, and serviceChargeRate, fallback to defaults if restaurant not loaded
  const deliveryFee = restaurant?.deliveryFee ?? 0;
  const taxRate = restaurant?.taxRate ?? 0.2;
  const serviceChargeRate = restaurant?.serviceChargeRate ?? 0;

  const summary = getCartSummary(deliveryFee, taxRate, serviceChargeRate);
  const orderTotal = summary.total + riderTip;

  const handleTipChange = (amount: number) => {
    setRiderTip(Math.max(0, riderTip + amount));
  };

  const renderItem: ListRenderItem<CartItem> = ({ item }) => {
    const itemPrice = item.dish.price * (1 - (item.dish.discountPercent ?? 0) / 100);
    const itemTotal = itemPrice * item.quantity;

    return (
      <TouchableOpacity style={styles.basketItem}>
        <View style={styles.basketItemContent}>
          <Text size="heading1" style={styles.basketItemQuantity}>
            {item.quantity}x
          </Text>
          <View style={styles.basketItemInfo}>
            <Text size="heading1">
              {item.dish.name}
            </Text>
            {item.dish.description && (
              <Text color="secondary" numberOfLines={2}>
                {item.dish.description}
              </Text>
            )}
          </View>
          <View style={styles.basketItemRight}>
            <Text size="heading1">
              {formatCurrency(itemTotal)}
            </Text>
            <Icon name="CaretRightIcon" size={20} color={colors.brandPrimary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => {
    return <View style={[styles.separator, { borderBottomColor: colors.border }]} />;
  };

  const renderTopTenRatedItem: ListRenderItem<Dish> = ({ item }) => (
    <View style={styles.topTenRatedItemsGrid}>
      <TopRatedMenuItemCard item={item} onPress={() => addDishToCart(item)} />
    </View>
  );

  const addDishToCart = (item: Dish) => {
    if (item) {
      addItem(item, 1);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Show login modal or navigate to login
      // For now, just return
      return;
    }

    if (items.length === 0 || !restaurant) {
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderData: PlaceOrderRequestBody = {
        restaurantId: restaurant.id,
        items: items.map((item) => ({
          dishId: item.dish.id,
          quantity: item.quantity,
          specialInstructions: item.notes || null,
        })),
        deliveryAddress: DELIVERY_ADDRESS, // TODO: Get from user profile or address selection
        deliveryInstructions: null,
      };

      await placeOrderMutation.mutateAsync(orderData);

      // Clear cart and close modal on success
      clearCart();
      setRiderTip(0);
      onClose();
    } catch (error) {
      // Error handling - could show toast/alert here
      console.error('Failed to place order:', error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: colors.backgroundSecondary }]}>
        <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.background }, shadows.card]}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <Icon name="XIcon" weight="bold" size={20} color={colors.brandPrimary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text weight="bold">
                Your order
              </Text>
              {restaurant && (
                <Text size="small" color="secondary">
                  {restaurant.name}
                </Text>
              )}
            </View>
            {items.length > 0 && (
              <TouchableOpacity onPress={clearCart} style={styles.headerButton}>
                <Icon name="TrashIcon" weight="bold" size={20} color={colors.brandPrimary} />
              </TouchableOpacity>
            )}
          </View>

          {items.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="ShoppingCartIcon" size={64} color={colors.textSecondary} />
              <Text size="heading2" weight="bold" style={styles.emptyText}>
                Your cart is empty
              </Text>
              <Text color="secondary">Add items from the menu to get started</Text>
            </View>
          ) : (
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
              {/* Basket Section */}
              <View style={styles.section}>
                <Text size="heading1" weight="bold" style={styles.sectionTitle}>
                  Basket
                </Text>
                <View
                  style={[
                    styles.sectionContent,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <FlatList
                    data={items}
                    keyExtractor={(item) => item.dish.id.toString()}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    ItemSeparatorComponent={renderSeparator}
                    style={[styles.selectedItemsList, { borderBottomColor: colors.border }]}
                  />

                  <Text style={styles.sectionSubTitle}>
                    People also added
                  </Text>
                  <View style={styles.peopleAlsoAddedItems}>
                    <FlatList
                      data={thingsMorePossibleToAdd}
                      keyExtractor={item => item.id.toString()}
                      renderItem={renderTopTenRatedItem}
                      horizontal
                    />
                  </View>
                </View>
              </View>

              {/* Savings and Offers Section */}
              <View style={styles.section}>
                <Text size="heading1" weight="bold" style={styles.sectionTitle}>
                  Savings and offers
                </Text>
                <TouchableOpacity
                  style={[
                    styles.sectionContent,
                    styles.viewOffersButton,
                    { borderColor: colors.border },
                  ]}
                >
                  <Text size="heading1">
                    View offers
                  </Text>
                  <Icon name="CaretRightIcon" size={20} color={colors.brandPrimary} />
                </TouchableOpacity>

                <View
                  style={[
                    styles.basketSubtotalRow,
                    styles.sectionContent,
                    { borderColor: colors.border },
                  ]}
                >
                  <Text size="heading1" color="secondary">
                    Basket subtotal
                  </Text>
                  <Text size="heading1">
                    {formatCurrency(summary.subtotal)}
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.feesHeader}>
                  <Text size="heading1" weight="bold" style={styles.feesTitle}>
                    Fees
                  </Text>
                  <Icon name="QuestionIcon" size={20} color={colors.brandPrimary} />
                </View>
                <View style={[styles.sectionContent, { borderColor: colors.border }]}>
                  <View style={styles.summaryRow}>
                    <Text size="heading1" color="secondary">
                      Service fee
                    </Text>
                    <Text size="heading1">
                      {formatCurrency(summary.serviceFee)}
                    </Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text size="heading1" color="secondary">
                      Delivery fee
                    </Text>
                    <Text size="heading1">
                      {formatCurrency(summary.deliveryFee)}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}

          {/* Checkout Button Container*/}
          <View
            style={[
              styles.checkoutButtonContainer,
              { backgroundColor: colors.background },
              shadows.cardWithoutBottomShadow,
            ]}
          >
            <View style={[styles.summaryRow, styles.riderTipSection]}>
              <View style={styles.riderTipTitle}>
                <Text size="heading1">
                  Rider tip
                </Text>
                <Icon name="SmileyIcon" size={18} />
              </View>
              <View style={styles.riderTipControls}>
                <TouchableOpacity
                  onPress={() => handleTipChange(-0.5)}
                  style={styles.tipButton}
                  disabled={riderTip === 0}
                >
                  <Icon
                    name="MinusCircleIcon"
                    size={18}
                    weight="bold"
                    color={riderTip === 0 ? colors.textInactive : colors.brandPrimary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleTipChange(0.5)}
                  style={styles.tipButton}
                >
                  <Icon
                    name="PlusCircleIcon"
                    size={18}
                    weight="bold"
                    color={colors.brandPrimary}
                  />
                </TouchableOpacity>
                <Text size="body" weight="medium" style={styles.tipAmount}>
                  {formatCurrency(riderTip)}
                </Text>
              </View>
            </View>

            <View style={[styles.summaryRow, styles.orderTotalRow]}>
              <Text size="heading1">
                Order total
              </Text>
              <Text size="heading1" weight="bold">
                {formatCurrency(orderTotal)}
              </Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.checkoutButton,
                { backgroundColor: colors.brandPrimaryLight },
                pressed && styles.checkoutButtonPressed,
                (isPlacingOrder || !isAuthenticated) && styles.checkoutButtonDisabled,
              ]}
              onPress={handleCheckout}
              disabled={isPlacingOrder || !isAuthenticated || items.length === 0}
            >
              {isPlacingOrder ? (
                <ActivityIndicator size="small" color={colors.background} />
              ) : (
                <Text size="heading1" weight="bold" color="primaryInverted" style={styles.checkoutButtonText}>
                  {!isAuthenticated ? 'Sign in to checkout' : 'Go to checkout'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  basketItem: {
    marginTop: 8,
  },
  basketItemContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  basketItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  basketItemQuantity: {
    minWidth: 32,
  },
  basketItemRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
  },
  basketSubtotalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 46,
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  checkoutButton: {
    borderRadius: 4,
    height: 48,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  checkoutButtonContainer: {
    height: 140,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonPressed: {
    opacity: 0.8,
  },
  checkoutButtonText: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    marginBottom: 8,
    marginTop: 16,
  },
  feesHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  feesTitle: {
    marginBottom: 0,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 56,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  orderTotalRow: {
    height: 36,
  },
  peopleAlsoAddedItems: {
    alignItems: 'center',
    height: 120,
    paddingVertical: 4,
  },
  riderTipControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  riderTipSection: {
    height: 36,
  },
  riderTipTitle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    paddingTop: 12,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionContent: {
    borderRadius: 4,
    borderWidth: 1,
    gap: 4,
    padding: 8,
    width: '100%',
  },
  sectionSubTitle: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  selectedItemsList: {
    borderBottomWidth: 1,
    marginBottom: 12,
    paddingBottom: 16,
  },
  separator: {
    borderBottomWidth: 1,
    height: 0,
    marginBottom: 4,
    marginTop: 12,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  tipAmount: {
    minWidth: 60,
    textAlign: 'right',
  },
  tipButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  topTenRatedItemsGrid: {
    marginBottom: 8,
    marginRight: 12,
    marginTop: 4,
  },
  viewOffersButton: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 46,
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 12,
    paddingVertical: 12,
  },
});

