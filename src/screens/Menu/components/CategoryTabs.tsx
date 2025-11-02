import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '@components';
import { MenuCategory } from '@types';

import { colors } from '../../../theme/colors';

type Props = {
  categories: MenuCategory[];
  activeCategoryId?: number | null;
  onChange: (categoryId: number) => void;
};

export default function CategoryTabs({ categories, activeCategoryId, onChange }: Props) {
  const items = useMemo(() => categories, [categories]);

  return (
    <View style={styles.container}>
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
              <Text color={active ? 'primary' : 'secondary'}>{category.name}</Text>
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
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.brandYellowLight,
    borderColor: colors.brandYellow,
  },
  container: {
    backgroundColor: colors.background,
    paddingVertical: 8,
  },
  content: {
    paddingHorizontal: 12,
  },
});
