import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon, PhosphorIconName, Text } from '@components';
import { useColors, useShadows } from '@theme';
import { Dish } from '@types';
import { formatCurrency } from '@utils';

type Props = {
    isLoadingSelectedItem: boolean;
    selectedMenuItem?: Dish;
    onPressClose: () => void;
    onPressAddToCart: (quantity: number) => void;
    visible: boolean;
    allergens?: string[];
}

export default function SelectedMenuItem({
  isLoadingSelectedItem,
  selectedMenuItem,
  visible,
  onPressClose,
  onPressAddToCart,
  allergens = ['eggs', 'gluten', 'milk', 'soybeans', 'sulphur dioxide/sulphites'],
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const scrollY = useSharedValue(0);

  const colors = useColors();
  const shadows = useShadows();

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const mapTagToIcon = (tag: string) => {
    let iconName: PhosphorIconName = 'ChecksIcon';

    switch (tag.toLowerCase()) {
      case 'vegan':
        iconName = 'LeafIcon';
        break;
      case 'vegetarian':
        iconName = 'PlantIcon';
        break;
      case 'gluten-free':
        iconName = 'GrainsIcon';
        break;
      case 'halal':
        iconName = 'StarAndCrescentIcon';
        break;
      case 'spicy':
        iconName = 'PepperIcon';
        break;
      case 'organic':
        iconName = 'CloverIcon';
        break;
    }

    return iconName;
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    onPressAddToCart(quantity);
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const stickyHeaderStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [260, 265],
      [0, 1],
      'clamp',
    );
    return {
      backgroundColor: colors.background,
      borderBottomColor: colors.border,
      opacity,
    };
  });

  if (!selectedMenuItem) return null;
  const totalPrice = selectedMenuItem.price * quantity;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onPressClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        <SafeAreaView edges={['top', 'bottom']} style={[styles.safeAreaView, { backgroundColor: colors.background }]}>
          {isLoadingSelectedItem ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brandPrimary} />
            </View>
          ) : selectedMenuItem ? (
            <View style={styles.modalContent}>
              <Animated.View style={[styles.stickyHeader, stickyHeaderStyle]}>
                <Text size="heading2" weight="bold" style={styles.stickyHeaderText}>
                  {selectedMenuItem.name}
                </Text>
              </Animated.View>

              <TouchableOpacity
                onPress={onPressClose}
                style={[styles.modalCloseButton, { backgroundColor: colors.background }, shadows.card]}
              >
                <Icon name="XIcon" size={20} color={colors.brandPrimary} weight="bold" />
              </TouchableOpacity>

              <Animated.ScrollView
                onScroll={scrollHandler}
                style={[styles.scrollView, { backgroundColor: colors.background }]}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={styles.modalHeader}>
                  <View style={[styles.imageContainer, { backgroundColor: colors.background }]}>
                    {selectedMenuItem.imageUri ? (
                      <Image source={{ uri: selectedMenuItem.imageUri }} style={styles.modalImage} />
                    ) : (
                      <View style={[styles.modalImage, { backgroundColor: colors.brandPrimaryLight }]} />
                    )}
                  </View>
                </View>

                <View style={styles.modalDetails}>
                  <Text size="heading2" weight="bold" style={styles.modalTitle}>
                    {selectedMenuItem.name}
                  </Text>

                  {selectedMenuItem.kcal && (
                    <Text color="secondary" style={styles.modalCalories}>
                      {selectedMenuItem.kcal} kcal
                    </Text>
                  )}

                  {selectedMenuItem.tags && selectedMenuItem.tags.length > 0 && (
                    <View style={styles.modalTags}>
                      {selectedMenuItem.tags.map((tag: string, index: number) => (
                        <View key={index} style={[styles.tag, { backgroundColor: colors.successLight }]}>
                          <Icon
                            name={mapTagToIcon(tag)}
                            size={16}
                            color={colors.success}
                            weight="regular"
                          />
                          <Text size="small" color='success'>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {selectedMenuItem.description && (
                    <Text color="secondary" style={styles.modalDescription}>
                      {selectedMenuItem.description}
                    </Text>
                  )}

                  <View
                    style={[
                      styles.allergenSection,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.allergenText}>
                      Contains{' '}
                      <Text weight="bold">
                        {allergens.join(', ')}
                      </Text>
                    </Text>
                    <Text style={styles.allergenContact}>
                      Questions about allergens, ingredients or cooking methods?{' '}
                      <Text color="brandColor">
                        Please contact the restaurant.
                      </Text>
                    </Text>
                  </View>
                </View>
              </Animated.ScrollView>

              <View
                style={[
                  styles.bottomContainer,
                  { backgroundColor: colors.background },
                  shadows.cardWithoutBottomShadow,
                ]}
              >
                {/* {selectedMenuItem.isAvailable ? ( */}
                <View style={[styles.buttonContainer, { backgroundColor: colors.background }]}>
                  <View style={styles.quantitySelector}>
                    <TouchableOpacity
                      onPress={handleDecrement}
                      style={[styles.quantityButton, { backgroundColor: colors.background }]}
                      activeOpacity={0.7}
                      disabled={quantity === 1 || !selectedMenuItem.isAvailable}
                    >
                      <Icon
                        name="MinusCircleIcon"
                        size={20}
                        color={
                          (quantity === 1 || !selectedMenuItem.isAvailable)
                            ? colors.textInactive
                            : colors.brandPrimary
                        }
                        weight="bold"
                      />
                    </TouchableOpacity>
                    <Text
                      size="large"
                      weight="bold"
                      style={styles.quantityText}
                      color={selectedMenuItem.isAvailable ? 'primary' : 'inactive'}
                    >
                      {quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={handleIncrement}
                      style={styles.quantityButton}
                      activeOpacity={0.7}
                      disabled={!selectedMenuItem.isAvailable}
                    >
                      <Icon
                        name="PlusCircleIcon"
                        size={20}
                        color={selectedMenuItem.isAvailable ? colors.brandPrimary : colors.textInactive}
                        weight="bold"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={handleAddToCart}
                    style={[
                      styles.addToCartButton,
                      shadows.card,
                      { backgroundColor: selectedMenuItem.isAvailable ? colors.brandPrimaryLight : colors.inactive },
                    ]}
                    activeOpacity={0.8}
                    disabled={!selectedMenuItem.isAvailable}
                  >
                    <Text
                      weight="bold"
                      color={selectedMenuItem.isAvailable ? 'primaryInverted' : 'inactive'}
                    >
                      {
                        selectedMenuItem.isAvailable
                          ? `Add for ${formatCurrency(totalPrice)}`
                          : 'Item not available'
                      }
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
        </SafeAreaView>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  addToCartButton: {
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
    width: '100%',
  },
  allergenContact: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  allergenSection: {
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 24,
    padding: 16,
  },
  allergenText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bottomContainer: {
    height: 100,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    height: 276,
    position: 'relative',
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  modalCalories: {
    marginBottom: 12,
    marginTop: 4,
  },
  modalCloseButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    top: 10,
    width: 36,
    zIndex: 1,
  },
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalDetails: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  modalHeader: {
    paddingBottom: 8,
  },
  modalImage: {
    height: 276,
    width: '100%',
  },
  modalTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  modalTitle: {
    marginBottom: 4,
  },
  quantityButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  quantitySelector: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 8,
    width: 200,
  },
  quantityText: {
    fontSize: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  safeAreaView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1,
  },
  stickyHeader: {
    borderBottomWidth: 1,
    elevation: 1,
    height: 56,
    justifyContent: 'center',
    left: 0,
    paddingHorizontal: 16,
    position: 'absolute',
    right: 0,
    textAlign: 'center',
    top: 0,
    zIndex: 1,
  },
  stickyHeaderText: {
    textAlign: 'center',
  },
  tag: {
    alignItems: 'center',
    borderRadius: 3,
    flexDirection: 'row',
    gap: 6,
    height: 24,
    paddingHorizontal: 10,
  },
});
