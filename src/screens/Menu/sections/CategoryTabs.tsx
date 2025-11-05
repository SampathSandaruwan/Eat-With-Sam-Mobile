import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '@components';
import { colors, SCREEN_WIDTH, shadows, TOP_CATEGORY_HEADER_HEIGHT } from '@theme';
import { MenuCategory } from '@types';

type Props = {
  categories: MenuCategory[];
  activeCategoryId?: number | null;
  onChange: (categoryId: number) => void;
};

export type CategoryTabsRef = {
  scrollToCategory: (categoryId: number) => void;
};

type TabLayout = {
  x: number;
  width: number;
};

const CategoryTabs = forwardRef<CategoryTabsRef, Props>(({ categories, activeCategoryId, onChange }, ref) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const tabLayouts = useRef<Map<number, TabLayout>>(new Map());

  const items = useMemo(() => categories, [categories]);

  const scrollToCategory = useCallback((categoryId: number) => {
    const layout = tabLayouts.current.get(categoryId);
    if (layout && scrollViewRef.current) {
      // Position = tab center (x + width/2) - half screen width
      const tabCenterX = layout.x + layout.width / 2;
      const scrollPosition = Math.max(0, tabCenterX - SCREEN_WIDTH / 2);

      scrollViewRef.current.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    } else if (scrollViewRef.current) {
      // a short delay to ensure the layout is ready after a retry (150ms)
      setTimeout(() => {
        const retryLayout = tabLayouts.current.get(categoryId);
        if (retryLayout) {
          const tabCenterX = retryLayout.x + retryLayout.width / 2;
          const scrollPosition = Math.max(0, tabCenterX - SCREEN_WIDTH / 2);
          scrollViewRef.current?.scrollTo({
            x: scrollPosition,
            animated: true,
          });
        }
      }, 150);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    scrollToCategory,
  }), [scrollToCategory]);

  // Auto-scroll when activeCategoryId changes and layout is available
  useEffect(() => {
    if (activeCategoryId !== null && activeCategoryId !== undefined) {
      // Small delay to ensure layouts are measured
      const timeoutId = setTimeout(() => {
        scrollToCategory(activeCategoryId);
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [activeCategoryId, scrollToCategory]);

  return (
    <View style={[styles.container, shadows.cardWithoutTopShadow]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {items.map((category) => {
          const active = category.id === activeCategoryId;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              key={category.id}
              onPress={() => onChange(category.id)}
              style={[styles.chip, active && styles.chipActive]}
              onLayout={(event) => {
                const { x, width } = event.nativeEvent.layout;
                tabLayouts.current.set(category.id, { x, width });
              }}
            >
              <Text
                color={active ? 'primaryInverted' : 'brandColor'}
                weight={active ? 'bold' : 'regular'}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

CategoryTabs.displayName = 'CategoryTabs';

export default CategoryTabs;

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    height: 24,
    marginRight: 8,
    paddingHorizontal: 16,
  },
  chipActive: {
    backgroundColor: colors.brandPrimaryLight,
    borderColor: colors.brandPrimary,
  },
  container: {
    backgroundColor: colors.background,
    height: TOP_CATEGORY_HEADER_HEIGHT,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    width: SCREEN_WIDTH,
  },
  content: {
    alignItems: 'center',
    height: '100%',
  },
});
