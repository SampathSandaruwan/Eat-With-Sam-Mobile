import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '@components';
import { colors, SCREEN_WIDTH, shadows } from '@theme';
import { MenuCategory } from '@types';

type Props = {
  categories: MenuCategory[];
  activeCategoryId?: number | null;
  onChange: (categoryId: number) => void;
};

export default function CategoryTabs({ categories, activeCategoryId, onChange }: Props) {
  const items = useMemo(() => categories, [categories]);

  return (
    <View style={[styles.container, shadows.cardWithoutTopShadow]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.content}>
        {items.map(category => {
          const active = category.id === activeCategoryId;
          return (
            <TouchableOpacity
              accessibilityRole="button"
              key={category.id}
              onPress={() => onChange(category.id)}
              style={[styles.chip, active && styles.chipActive]}
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
}

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
    height: 74,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    width: SCREEN_WIDTH,
  },
  content: {
    alignItems: 'center',
    height: '100%',
  },
});
