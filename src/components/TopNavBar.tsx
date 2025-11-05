import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useDrawer } from '@contexts';
import { TOP_NAV_HEIGHT, useColors } from '@theme';

import Icon from './Icon';

import { logoImage } from '../assets/images';
import { RootStackParams } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParams>;

export default function TopNavBar() {
  const { openDrawer } = useDrawer();
  const colors = useColors();

  const navigation = useNavigation<NavigationProp>();

  const handlePressSearch = () => {
    // eslint-disable-next-line no-console
    console.log('TODO: Handle press search');
  };

  const handlePressHome = () => {
    navigation.navigate('Restaurants');
  };

  const handlePressAccount = () => {
    openDrawer();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.logoContainer}>
        <Image source={logoImage} style={styles.logoImage} resizeMode="contain" />
      </View>

      <View style={styles.headerButtons}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handlePressSearch}
          style={[
            styles.headerButton,
            styles.searchButton,
            { borderColor: colors.border },
          ]}
        >
          <Icon name="MagnifyingGlass" size={18} color={colors.brandPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handlePressHome}
          style={[
            styles.headerButton,
            styles.actionButton,
            { borderColor: colors.border },
          ]}
        >
          <Icon name="HouseIcon" size={18} color={colors.brandPrimary} />
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handlePressAccount}
          style={[
            styles.headerButton,
            styles.actionButton,
            { borderColor: colors.border },
          ]}
        >
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
