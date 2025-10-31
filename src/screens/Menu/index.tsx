import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';

import { Icon, Text } from '@components';
import { colors, TOP_NAV_HEIGHT } from '@theme';
import { MenuCategory, MenuItem } from '@types';

import { CategoryTabs, MenuItemCard, TopNavBar } from './components';

type Section = {
  id: string;
  categoryId: string;
  items: MenuItem[];
};

const SAMPLE_CATEGORIES: MenuCategory[] = [
  { id: 'deals', label: 'Deals', emoji: '💥' },
  { id: 'bowls', label: 'Power Bowls', emoji: '🥗' },
  { id: 'wraps', label: 'Wraps', emoji: '🌯' },
  { id: 'smoothies', label: 'Smoothies', emoji: '🥤' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
];

const SAMPLE_SECTIONS: Section[] = [
  {
    id: 's1',
    categoryId: 'deals',
    items: [
      {
        id: 'i1',
        title: 'Korean Kimchi Chicken Powerbowl',
        description: 'Roasted or spicy chicken, fragrant basmati rice',
        price: '£9.99',
        kcal: 305,
        tags: ['New', 'Spicy'],
        discountPercent: 40,
        imageUri:
          'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'i2',
        title: 'Mighty Mexican',
        description: 'Our bestseller with salsa and beans',
        price: '£9.99',
        kcal: 277,
        tags: ['Vegetarian'],
        discountPercent: 40,
        imageUri:
          'https://images.unsplash.com/photo-1604908554049-06274c40e5e9?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'i3',
        title: 'Shawarma Powerbowl',
        description: 'Delicious dish filled with middle eastern flavors',
        price: '£9.99',
        kcal: 360,
        tags: ['Vegan'],
        imageUri:
          'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'i4',
        title: 'Wasabi & Yuzu Powerbowl',
        description: 'Hawaiian poke bowls with zing',
        price: '£9.99',
        kcal: 305,
        tags: ['Vegan'],
        imageUri:
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 's2',
    categoryId: 'bowls',
    items: [
      {
        id: 'i3',
        title: 'Shawarma Powerbowl',
        description: 'Delicious dish filled with middle eastern flavors',
        price: '£9.99',
        kcal: 360,
        tags: ['Vegan'],
        imageUri:
          'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'i4',
        title: 'Wasabi & Yuzu Powerbowl',
        description: 'Hawaiian poke bowls with zing',
        price: '£9.99',
        kcal: 305,
        tags: ['Vegan'],
        imageUri:
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 's3',
    categoryId: 'wraps',
    items: [
      {
        id: 'i5',
        title: 'Chicken Wrap',
        description: 'Delicious wrap with chicken and vegetables',
        price: '£9.99',
        kcal: 305,
        tags: ['Vegan'],
        imageUri:
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'i6',
        title: 'Chicken Wrap',
        description: 'Delicious wrap with chicken and vegetables',
        price: '£9.99',
        kcal: 305,
        tags: ['Vegan'],
        imageUri:
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop',
      },
      {
        id: 'i7',
        title: 'Chicken Wrap',
        description: 'Delicious wrap with chicken and vegetables',
        price: '£9.99',
        kcal: 305,
        tags: ['Vegan'],
        imageUri:
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 's4',
    categoryId: 'smoothies',
    items: [
      {
        id: 'i6',
        title: 'Green Smoothie',
        description: 'Delicious smoothie with green vegetables',
        price: '£9.99',
        kcal: 305,
        tags: ['Vegan'],
        imageUri:
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 's5',
    categoryId: 'desserts',
    items: [
      {
        id: 'i7',
        title: 'Chocolate Cake',
        description: 'Delicious cake with chocolate',
        price: '£9.99',
        kcal: 305,
        tags: ['Vegan'],
        imageUri:
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop',
      },
    ],
  },
];

const TOP_NAV_HEIGHT_WITH_PADDING = TOP_NAV_HEIGHT;

export default function MenuScreen() {
  const [activeCategoryId, setActiveCategoryId] = useState(SAMPLE_CATEGORIES[0].id);
  const scrollYRef = useRef(new Animated.Value(0));
  const scrollY = scrollYRef.current;

  const items = useMemo(() => {
    const visibleSections = SAMPLE_SECTIONS.filter(
      section => section.categoryId === activeCategoryId,
    );
    return visibleSections.flatMap(section => section.items);
  }, [activeCategoryId]);

  const renderItem: ListRenderItem<MenuItem> = ({ item }) => (
    <View style={styles.gridItem}>
      <MenuItemCard item={item} />
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
            opacity: scrollY.interpolate({ inputRange: [295, 300], outputRange: [0, 1], extrapolate: 'clamp' }),
          },
        ]}
      >
        <View style={styles.tabsWrapper}>
          <CategoryTabs
            categories={SAMPLE_CATEGORIES}
            activeCategoryId={activeCategoryId}
            onChange={setActiveCategoryId}
          />
        </View>
      </Animated.View>

      {/* The list of menu items */}
      <Animated.FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.grid}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        ListHeaderComponent={
          <View>
            <View>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1600&auto=format&fit=crop',
                }}
                style={styles.banner}
              />

              <View style={styles.roundBackWrapper}>
                <View style={styles.roundBack}>
                  <Icon name="ArrowLeft" size={22} color={colors.brandYellow} weight="bold" />
                </View>
              </View>
            </View>

            <View style={styles.header}>
              <Text size="heading2" weight="bolder">Tossed - St Martin&apos;s Lane</Text>
              <Text color='secondary' style={styles.subtle}>Halal · Salads · Healthy</Text>

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
                categories={SAMPLE_CATEGORIES}
                activeCategoryId={activeCategoryId}
                onChange={setActiveCategoryId}
              />
            </View>
          </View>
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
});

