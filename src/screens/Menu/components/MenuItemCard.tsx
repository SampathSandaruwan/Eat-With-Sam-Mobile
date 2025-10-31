import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Text } from '@components';
import { MenuItem } from '@types';

import { colors, shadows } from '../../../theme/colors';

type Props = {
  item: MenuItem;
};

export default function MenuItemCard({ item }: Props) {
  return (
    <View style={[styles.card, shadows.card]}>
      <View style={styles.imageWrapper}>
        {item.discountPercent ? (
          <View style={styles.badge}>
            <Text>{item.discountPercent}% off</Text>
          </View>
        ) : null}

        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
      </View>

      <View style={styles.content}>
        <Text weight="bold">{item.title}</Text>
        {!!item.description && <Text color="secondary">{item.description}</Text>}

        <View style={styles.metaRow}>
          <Text color="secondary">{item.price}</Text>
          {typeof item.kcal === 'number' && (
            <Text color="secondary">{item.kcal} kcal</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.brandYellow,
    borderRadius: 8,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'absolute',
    top: 12,
    zIndex: 1,
  },
  card: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 12,
  },
  image: {
    height: 160,
    width: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.brandYellowLight,
  },
  imageWrapper: {
    position: 'relative',
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
