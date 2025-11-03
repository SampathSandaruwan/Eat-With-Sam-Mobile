import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { logoImage } from '@assets/images';
import { useDrawer } from '@contexts';
import { colors, TOP_NAV_HEIGHT } from '@theme';

import Icon from './Icon';
import Text from './Text';

export default function TopNavBar() {
  const { openDrawer } = useDrawer();

  const handlePressSearch = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: Handle press search');
  };

  const handlePressHome = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: Handle press home');
  };

  const handlePressAccount = () => {
    openDrawer();
  };

  return (
    <View style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logoImage} />
          <Text size="heading1" weight="bolder" color="brandColor">EatWithSam</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity accessibilityRole="button" onPress={handlePressSearch} style={styles.actionBtn}>
            <Icon name="MagnifyingGlass" size={22} color={colors.brandYellow} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" onPress={handlePressHome} style={styles.actionBtn}>
            <Icon name="HouseIcon" size={22} color={colors.brandYellow} />
          </TouchableOpacity>
          <TouchableOpacity accessibilityRole="button" onPress={handlePressAccount} style={styles.actionBtn}>
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

