import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useDrawer } from '@contexts';
import { colors, TOP_NAV_HEIGHT } from '@theme';

import Icon from './Icon';

import { logoImage } from '../assets/images';

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
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
      </View>

      <View style={styles.headerButtons}>
        <TouchableOpacity accessibilityRole="button" onPress={handlePressSearch} style={[styles.headerButton, styles.searchButton]}>
          <Icon name="MagnifyingGlass" size={18} color={colors.brandPrimary} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" onPress={handlePressHome} style={[styles.headerButton, styles.actionButton]}>
          <Icon name="HouseIcon" size={18} color={colors.brandPrimary} />
        </TouchableOpacity>
        <TouchableOpacity accessibilityRole="button" onPress={handlePressAccount} style={[styles.headerButton, styles.actionButton]}>
          <Icon name="UserIcon" size={18} color={colors.brandPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    width: 38,
  },
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexDirection: 'row',
    flex: 1,
    height: TOP_NAV_HEIGHT,
    left: 0,
    paddingHorizontal: 12,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 20,
  },
  headerButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  logoContainer: {
    flex: 1,
    gap: 4,
  },
  logoImage: {
    height: 36,
    width: 120,
  },
  searchButton: {
    marginRight: 8,
    width: 46,
  },
});

