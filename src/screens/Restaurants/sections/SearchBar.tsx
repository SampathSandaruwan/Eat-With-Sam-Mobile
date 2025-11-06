import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Icon, Text } from '@components';
import { useColors, useShadows } from '@theme';

type Props = {
  placeholder?: string;
  onPress?: () => void;
};

export default function SearchBar({ placeholder = 'Search Deliveroo', onPress }: Props) {
  const colors = useColors();
  const shadows = useShadows();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.background }, shadows.card]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon name="MagnifyingGlass" size={20} color={colors.textSecondary} />
      <Text size="body" color="secondary" style={styles.placeholder}>
        {placeholder}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  placeholder: {
    flex: 1,
  },
});

