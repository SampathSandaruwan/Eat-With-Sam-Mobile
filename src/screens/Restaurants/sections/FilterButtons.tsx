import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Icon, PhosphorIconName, Text } from '@components';
import { colors } from '@theme';

type FilterOption = {
  id: string;
  label: string;
  icon?: PhosphorIconName;
};

type Props = {
  filters?: FilterOption[];
  selectedFilterId?: string;
  onFilterPress?: (filterId: string) => void;
};

const defaultFilters: FilterOption[] = [
  { id: 'offers', label: 'Offers', icon: 'Tag' },
  { id: 'deliveryFee', label: 'Delivery Fee', icon: 'CaretDown' },
  { id: 'under30', label: 'Under 30 min' },
  { id: 'dietary', label: 'Dietary', icon: 'ForkKnife' },
];

export default function FilterButtons({
  filters = defaultFilters,
  selectedFilterId,
  onFilterPress,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            selectedFilterId === filter.id && styles.filterButtonSelected,
          ]}
          onPress={() => onFilterPress?.(filter.id)}
          activeOpacity={0.7}
        >
          {filter.icon && (
            <Icon
              name={filter.icon}
              size={16}
              color={selectedFilterId === filter.id ? colors.brandYellow : colors.textSecondary}
            />
          )}
          <Text
            size="body"
            weight={selectedFilterId === filter.id ? 'medium' : 'regular'}
            color={selectedFilterId === filter.id ? 'primary' : 'secondary'}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    alignItems: 'center',
    backgroundColor: colors.border,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButtonSelected: {
    backgroundColor: colors.surface,
    borderColor: colors.brandYellow,
    borderWidth: 1,
  },
  scrollView: {
    flexGrow: 0,
  },
});

