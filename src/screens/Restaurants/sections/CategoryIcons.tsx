import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Icon, PhosphorIconName,Text } from '@components';
import { colors } from '@theme';

type Category = {
  id: string;
  name: string;
  icon: PhosphorIconName;
};

type Props = {
  categories?: Category[];
  selectedCategoryId?: string;
  onCategoryPress?: (categoryId: string) => void;
};

const defaultCategories: Category[] = [
  { id: 'grocery', name: 'Grocery', icon: 'ShoppingCartSimple' },
  { id: 'burgers', name: 'Burgers', icon: 'Hamburger' },
  { id: 'pizza', name: 'Pizza', icon: 'Pizza' },
  { id: 'convenience', name: 'Convenient', icon: 'Package' },
  { id: 'sandwich', name: 'Sandwich', icon: 'Hamburger' },
  { id: 'indian', name: 'India', icon: 'BowlFood' },
];

export default function CategoryIcons({
  categories = defaultCategories,
  selectedCategoryId,
  onCategoryPress,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryItem}
          onPress={() => onCategoryPress?.(category.id)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Icon
              name={category.icon}
              size={32}
              color={selectedCategoryId === category.id ? colors.brandPrimary : colors.textPrimary}
            />
          </View>
          <Text size="small" color={selectedCategoryId === category.id ? 'primary' : 'secondary'} style={styles.label}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 35,
    height: 70,
    justifyContent: 'center',
    marginBottom: 8,
    width: 70,
  },
  label: {
    textAlign: 'center',
  },
  scrollView: {
    flexGrow: 0,
  },
});

