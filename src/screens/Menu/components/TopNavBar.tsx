import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '@components';
import { colors,TOP_NAV_HEIGHT  } from '@theme';

import { logoImage } from '../../../assets/images';
import Icon from '../../../components/Icon';

type Props = {
  onPressSearch?: () => void;
  onPressHome?: () => void;
  onPressAccount?: () => void;
};

export default function TopNavBar({ onPressSearch, onPressHome, onPressAccount }: Props) {
  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logoImage} />
          <Text size="heading1" weight="bolder" color="brandColor">EatWithSam</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity accessibilityRole="button" onPress={onPressSearch} style={styles.actionBtn}>
            <Icon name="MagnifyingGlass" size={22} color={colors.brandYellow} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" onPress={onPressHome} style={styles.actionBtn}>
            <Icon name="HouseIcon" size={22} color={colors.brandYellow} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" onPress={onPressAccount} style={styles.actionBtn}>
            <Icon name="UserIcon" size={22} color={colors.brandYellow} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBtn: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: TOP_NAV_HEIGHT,
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  logoContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  logoImage: {
    height: 36,
    width: 36,
  },
  safe: {
    backgroundColor: colors.background,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
});

