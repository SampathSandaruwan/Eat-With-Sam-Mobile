import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Icon, Text } from '@components';
import { colors } from '@theme';

type Props = {
  placeholder?: string;
  onPress?: () => void;
};

export default function SearchBar({ placeholder = 'Search Deliveroo', onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
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
    backgroundColor: colors.background,
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

