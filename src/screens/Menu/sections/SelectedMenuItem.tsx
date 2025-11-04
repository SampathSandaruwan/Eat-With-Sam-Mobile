import React, { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Icon, Text } from '@components';
import { colors } from '@theme';
import { MenuItem } from '@types';

type Props = {
    isLoadingSelectedItem: boolean;
    selectedMenuItem: MenuItem;
    onPressClose: () => void;
    onPressAddToCart: (quantity: number) => void;
}

export default function SelectedMenuItem({
  isLoadingSelectedItem,
  selectedMenuItem,
  onPressClose,
  onPressAddToCart,
}: Props) {
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    setAddedToCart(true);
    onPressAddToCart(quantity);
  };

  const totalPrice = (selectedMenuItem.price * quantity).toFixed(2);
  const addToCartButtonOpacityStyle = { opacity: addedToCart ? 0.6 : 1 };

  return (
    <View style={styles.modalContainer}>
      {isLoadingSelectedItem ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brandYellow} />
        </View>
      ) : selectedMenuItem ? (
        <>

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={onPressClose}
                style={styles.modalCloseButton}
              >
                <Icon name="XIcon" size={24} color={colors.textPrimary} weight="bold" />
              </TouchableOpacity>
              {selectedMenuItem.imageUri ? (
                <Image source={{ uri: selectedMenuItem.imageUri }} style={styles.modalImage} />
              ) : (
                <View style={[styles.modalImage, styles.imagePlaceholder]} />
              )}
            </View>

            <View style={styles.modalDetails}>
              <Text size="heading1" weight="bold" style={styles.modalTitle}>
                {selectedMenuItem.name}
              </Text>
              {selectedMenuItem.description && (
                <Text color="secondary" style={styles.modalDescription}>
                  {selectedMenuItem.description}
                </Text>
              )}

              <View style={styles.modalPriceRow}>
                <Text size="heading2" weight="bold">
                  £{selectedMenuItem.price.toFixed(2)}
                </Text>
                {selectedMenuItem.kcal && (
                  <Text color="secondary">{selectedMenuItem.kcal} kcal</Text>
                )}
              </View>

              {selectedMenuItem.tags && selectedMenuItem.tags.length > 0 && (
                <View style={styles.modalTags}>
                  {selectedMenuItem.tags.map((tag: string, index: number) => (
                    <View key={index} style={styles.tag}>
                      <Text weight="medium">{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              {selectedMenuItem.averageRating && (
                <View style={styles.modalRating}>
                  <Text weight="medium">Rating: {selectedMenuItem.averageRating.toFixed(1)}</Text>
                  {selectedMenuItem.ratingCount > 0 && (
                    <Text color="secondary">
                      ({selectedMenuItem.ratingCount} {selectedMenuItem.ratingCount === 1 ? 'review' : 'reviews'})
                    </Text>
                  )}
                </View>
              )}

              <Text color="secondary" style={styles.modalAvailability}>
                {selectedMenuItem.isAvailable ? 'Available' : 'Currently unavailable'}
              </Text>
            </View>
          </ScrollView>

          {selectedMenuItem.isAvailable ? (
            <View style={styles.buttonContainer}>
              <View style={styles.quantitySelector}>
                <TouchableOpacity
                  onPress={handleDecrement}
                  style={styles.quantityButton}
                  activeOpacity={0.7}
                  disabled={quantity === 1 || addedToCart}
                >
                  <Icon
                    name="MinusIcon"
                    size={18}
                    color={quantity === 1 || addedToCart ? colors.textInactive : colors.textPrimary}
                    weight="bold"
                  />
                </TouchableOpacity>
                <Text size="heading2" weight="bold" style={styles.quantityText}>
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={handleIncrement}
                  style={styles.quantityButton}
                  activeOpacity={0.7}
                  disabled={addedToCart}
                >
                  <Icon
                    name="PlusIcon"
                    size={18}
                    color={addedToCart ? colors.textInactive : colors.textPrimary}
                    weight="bold"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={handleAddToCart}
                style={[
                  styles.addToCartButton,
                  addedToCart ? styles.addToCartButtonSuccess : styles.addToCartButtonActive,
                  addToCartButtonOpacityStyle,
                ]}
                activeOpacity={0.8}
                disabled={addedToCart}
              >
                <Icon
                  name={addedToCart ? 'CheckIcon' : 'PlusIcon'}
                  size={20}
                  color={addedToCart ? colors.background : colors.textPrimary}
                  weight="bold"
                />
                <Text
                  size="heading2"
                  weight="medium"
                  color={addedToCart ? 'primaryInverted' : 'primary'}
                >
                  {addedToCart ? 'Added to Cart' : `Add for £${totalPrice}`}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <View style={[styles.addToCartButton, styles.addToCartButtonDisabled]}>
                <Icon name="PlusIcon" size={20} color={colors.textInactive} weight="bold" />
                <Text size="heading2" weight="medium" color="inactive">
                  Add to Cart
                </Text>
              </View>
            </View>
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  addToCartButton: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginBottom: 16,
    padding: 16,
  },
  addToCartButtonActive: {
    backgroundColor: colors.brandYellow,
  },
  addToCartButtonDisabled: {
    backgroundColor: colors.inactive,
  },
  addToCartButtonSuccess: {
    backgroundColor: colors.success,
  },
  buttonContainer: {
    backgroundColor: colors.background,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  imagePlaceholder: {
    backgroundColor: colors.brandYellowLight,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalAvailability: {
    fontSize: 14,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContainer: {
    backgroundColor: colors.background,
    flex: 1,
  },
  modalDescription: {
    marginBottom: 16,
  },
  modalDetails: {
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalImage: {
    height: 300,
    width: '100%',
  },
  modalPriceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  modalRating: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  modalTitle: {
    marginBottom: 8,
  },
  quantityButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  quantitySelector: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginBottom: 16,
  },
  quantityText: {
    minWidth: 30,
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  tag: {
    backgroundColor: colors.brandYellowLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
