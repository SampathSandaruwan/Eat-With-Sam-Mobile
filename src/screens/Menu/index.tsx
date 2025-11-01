import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  ListRenderItem,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Icon, Text } from '@components';
import { useMenuCategories, useMenuItem, useMenuItems } from '@hooks';
import { colors, TOP_NAV_HEIGHT } from '@theme';
import { MenuItem } from '@types';

import { CategoryTabs, MenuItemCard, TopNavBar } from './components';

const TOP_NAV_HEIGHT_WITH_PADDING = TOP_NAV_HEIGHT;

export default function MenuScreen() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>();
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<number | null>(null);
  const [mainItemId] = useState<number | null>(610);
  const scrollYRef = useRef(new Animated.Value(0));
  const scrollY = scrollYRef.current;

  const { data: mainMenuItem, isLoading: isLoadingMainItem } = useMenuItem(mainItemId);
  const { data: menuCategories } = useMenuCategories(mainMenuItem?.restaurantId ?? null);
  const { data: menuItems } = useMenuItems(activeCategoryId ?? null);
  const { data: selectedMenuItem, isLoading: isLoadingSelectedItem } = useMenuItem(selectedMenuItemId);

  useEffect(() => {
    if (menuCategories) {
      setActiveCategoryId(menuCategories[0]?.id ?? null);
    }
  }, [menuCategories]);

  const handleItemPress = (item: MenuItem) => {
    setSelectedMenuItemId(item.id);
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

      {/* Add-on Item Detail Modal */}
      <Modal
        visible={selectedMenuItemId !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedMenuItemId(null)}
      >
        <View style={styles.modalContainer}>
          {isLoadingSelectedItem ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brandYellow} />
            </View>
          ) : selectedMenuItem ? (
            <>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setSelectedMenuItemId(null)}
                  style={styles.modalCloseButton}
                >
                  <Icon name="ArrowLeft" size={24} color={colors.textPrimary} weight="bold" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalContent}>
                {selectedMenuItem.imageUri ? (
                  <Image source={{ uri: selectedMenuItem.imageUri }} style={styles.modalImage} />
                ) : (
                  <View style={[styles.modalImage, styles.imagePlaceholder]} />
                )}

                <View style={styles.modalDetails}>
                  <Text size="heading1" weight="bolder" style={styles.modalTitle}>
                    {selectedMenuItem.name}
                  </Text>
                  {selectedMenuItem.description && (
                    <Text color="secondary" style={styles.modalDescription}>
                      {selectedMenuItem.description}
                    </Text>
                  )}

                  <View style={styles.modalPriceRow}>
                    <Text size="heading2" weight="bolder">
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
                          <Text weight="bold">{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {selectedMenuItem.averageRating && (
                    <View style={styles.modalRating}>
                      <Text weight="bold">Rating: {selectedMenuItem.averageRating.toFixed(1)}</Text>
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
              </View>
            </>
          ) : null}
        </View>
      </Modal>

      {/* The category tabs that are sticky to the top of the header  on scroll */}
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.stickyTabsContainer,
          {
            opacity: scrollY.interpolate({ inputRange: [295, 300], outputRange: [0, 1], extrapolate: 'clamp' }),
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
          isLoadingMainItem ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brandYellow} />
            </View>
          ) : (
            <View>
              <View>
                <Image source={{ uri: mainMenuItem?.imageUri ?? '' }} style={styles.banner} />

                <View style={styles.roundBackWrapper}>
                  <View style={styles.roundBack}>
                    <Icon name="ArrowLeft" size={22} color={colors.brandYellow} weight="bold" />
                  </View>
                </View>
              </View>

              <View style={styles.header}>
                <Text size="heading2" weight="bolder">{mainMenuItem?.name}</Text>
                <Text color='secondary' style={styles.subtle}>{mainMenuItem?.price}</Text>

                <View style={styles.pillsRow}>
                  <View style={styles.infoPill}>
                    <Text weight="bold">4.8 Excellent</Text>
                  </View>
                  <View style={styles.infoPill}>
                    <Text weight="bold">5 - 15 min</Text>
                  </View>
                  <View style={styles.infoPill}>
                    <Text weight="bold">£8.00 min</Text>
                  </View>
                </View>
              </View>

              <View style={styles.tabsWrapper}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 200,
    width: '100%',
  },
  grid: {
    gap: 12,
  },
  gridItem: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  imagePlaceholder: {
    backgroundColor: colors.brandYellowLight,
  },
  infoPill: {
    backgroundColor: colors.brandYellowLight,
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
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
  modalContent: {
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
  pillsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  roundBack: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  roundBackWrapper: {
    left: 12,
    position: 'absolute',
    top: 12,
  },
  safe: {
    backgroundColor: colors.background,
    flex: 1,
  },
  stickyTabsContainer: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: TOP_NAV_HEIGHT_WITH_PADDING,
    zIndex: 9,
  },
  subtle: {
    marginTop: 4,
  },
  tabsWrapper: {
    backgroundColor: colors.background,
  },
  tag: {
    backgroundColor: colors.brandYellowLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});

