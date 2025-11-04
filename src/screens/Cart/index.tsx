import React from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, Text } from '@components';
import { useCartStore } from '@store';
import { colors, shadows } from '@theme';
import { CartItem } from '@types';

const DELIVERY_FEE = 2.99;
const TAX_RATE = 0.2;

type Props = {
  visible: boolean;
  onClose: () => void;
}

export default function CartModal({ visible, onClose }: Props) {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getCartSummary = useCartStore((state) => state.getCartSummary);

  const summary = getCartSummary(DELIVERY_FEE, TAX_RATE);

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const renderItem: ListRenderItem<CartItem> = ({ item }) => {
    const itemPrice = item.menuItem.price * (1 - (item.menuItem.discountPercent ?? 0) / 100);
    const itemTotal = itemPrice * item.quantity;

    return (
      <View style={[styles.cartItem, shadows.card]}>
        {item.menuItem.imageUri ? (
          <Image source={{ uri: item.menuItem.imageUri }} style={styles.itemImage} />
        ) : (
          <View style={[styles.itemImage, styles.imagePlaceholder]} />
        )}

        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <View style={styles.itemInfo}>
              <Text weight="medium" size="heading2">
                {item.menuItem.name}
              </Text>
              <Text color="secondary">£{itemPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.menuItem.id)} style={styles.removeButton}>
              <Icon name="XIcon" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              onPress={() => handleQuantityChange(item.menuItem.id, item.quantity - 1)}
              style={styles.quantityButton}
            >
              <Icon name="MinusIcon" size={18} color={colors.textPrimary} weight="bold" />
            </TouchableOpacity>
            <Text weight="medium" style={styles.quantityText}>
              {item.quantity}
            </Text>
            <TouchableOpacity
              onPress={() => handleQuantityChange(item.menuItem.id, item.quantity + 1)}
              style={styles.quantityButton}
            >
              <Icon name="PlusIcon" size={18} color={colors.textPrimary} weight="bold" />
            </TouchableOpacity>
          </View>

          <View style={styles.itemTotal}>
            <Text weight="medium" size="heading2">
              £{itemTotal.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.cartModalContainer}>
        <View style={styles.cartModalHeader}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.cartModalCloseButton}
          >
            <Icon name="ArrowLeftIcon" size={24} color={colors.textPrimary} weight="bold" />
          </TouchableOpacity>
        </View>

        <SafeAreaView edges={['top']} style={styles.container}>
          <View style={styles.header}>
            <Text size="heading1" weight="bold">
              Cart
            </Text>
            {items.length > 0 && (
              <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
                <Text color="secondary">Clear</Text>
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
            <>

              <View style={styles.listContentContainer}>
                <FlatList
                  data={items}
                  keyExtractor={(item) => item.menuItem.id.toString()}
                  renderItem={renderItem}
                  contentContainerStyle={styles.listContent}
                />
              </View>

              <View style={styles.summary}>
                <View style={styles.summaryRow}>
                  <Text color="secondary">Subtotal</Text>
                  <Text weight="bold">£{summary.subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text color="secondary">Delivery Fee</Text>
                  <Text weight="bold">£{summary.deliveryFee.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text color="secondary">Tax</Text>
                  <Text weight="bold">£{summary.tax.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text size="heading2" weight="bold">
                    Total
                  </Text>
                  <Text size="heading2" weight="bold">
                    £{summary.total.toFixed(2)}
                  </Text>
                </View>

                <Pressable
                  style={({ pressed }) => [
                    styles.checkoutButton,
                    pressed && styles.checkoutButtonPressed,
                  ]}
                >
                  <Text size="heading2" weight="bold" style={styles.checkoutButtonText}>
                    Proceed to Checkout
                  </Text>
                </Pressable>
              </View>
            </>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    backgroundColor: colors.background,
    borderRadius: 12,
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
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
  checkoutButton: {
    backgroundColor: colors.brandYellow,
    borderRadius: 12,
    marginTop: 16,
    padding: 16,
  },
  checkoutButtonPressed: {
    opacity: 0.8,
  },
  checkoutButtonText: {
    textAlign: 'center',
  },
  clearButton: {
    padding: 4,
  },
  container: {
    backgroundColor: colors.background,
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
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  imagePlaceholder: {
    backgroundColor: colors.brandYellowLight,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemImage: {
    borderRadius: 8,
    height: 80,
    width: 80,
  },
  itemInfo: {
    flex: 1,
  },
  itemTotal: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  listContent: {
    padding: 16,
  },
  listContentContainer: {
    backgroundColor: colors.brandYellowLight,
    flex: 1,
  },
  quantityButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  quantityControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  quantityText: {
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    paddingBottom: 32,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 12,
  },
});

