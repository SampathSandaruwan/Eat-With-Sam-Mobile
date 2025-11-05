import React, { useCallback, useEffect } from 'react';
import { Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Icon, PhosphorIconName, Text } from '@components';
import { colors, SCREEN_WIDTH, shadows } from '@theme';

import { logoImage } from '../assets/images';

const SWIPE_VELOCITY_THRESHOLD = 500; // Minimum velocity to auto-close

export type DrawerItem = {
  label: string;
  icon?: PhosphorIconName;
  onPress: () => void;
  showDivider?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  items: DrawerItem[];
  isAuthenticated?: boolean;
};

export default function RightDrawer({ visible, onClose, items, isAuthenticated = false }: Props) {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(SCREEN_WIDTH);
  const opacity = useSharedValue(0);

  const openCloseDrawer = useCallback((open: boolean) => {
    translateX.value = withTiming(
      open ? 0 : SCREEN_WIDTH,
      { duration: 250 },
    );
    opacity.value = withTiming(
      open ? 1 : 0,
      { duration: 250 },
    );
  }, [opacity, translateX]);

  useEffect(() => {
    if (visible) {
      // Open drawer
      openCloseDrawer(true);
    } else {
      // Close drawer
      openCloseDrawer(false);
    }
  }, [visible, openCloseDrawer]);

  // Pan gesture for swipe to close
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow closing gesture (swiping left/right)
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, SCREEN_WIDTH);
        // Adjust opacity based on drawer position
        const progress = Math.min(event.translationX / SCREEN_WIDTH, 1);
        opacity.value = Math.max(0, 1 - progress);
      }
    })
    .onEnd((event) => {
      const shouldClose =
        event.translationX > SCREEN_WIDTH * 0.3 ||
        event.velocityX > SWIPE_VELOCITY_THRESHOLD;

      if (shouldClose) {
        // Close drawer
        openCloseDrawer(false);
        scheduleOnRN(onClose);
      } else {
        // Snap back to open
        openCloseDrawer(true);
      }
    })
    .enabled(visible);


  const drawerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleBackdropPress = () => {
    if (visible) {
      onClose();
    }
  };

  // Always render to allow animations to complete smoothly
  // Use pointerEvents to control interaction instead of conditional rendering
  return (
    <View style={styles.container} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleBackdropPress}>
        <Animated.View style={[styles.backdropOverlay, backdropStyle]} />
      </Pressable>

      {/* Drawer Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.drawer, drawerStyle, { paddingTop: insets.top }, shadows.cardWithoutRightShadow]}>
          <View style={[styles.drawerContent, { paddingBottom: insets.bottom }]}>
            {/* Header */}
            <View style={styles.header}>
              <Image source={logoImage} style={styles.logo} resizeMode="contain" />
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="XIcon" size={24} color={colors.brandPrimary} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.itemsContainer}>
              {items.map((item, index) => {
                // Render "Sign up or log in" as a button for non-authenticated users
                if (!isAuthenticated && item.label === 'Sign up or log in') {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.signInButton}
                      onPress={() => {
                        item.onPress();
                        onClose();
                      }}
                      accessibilityRole="button"
                    >
                      <Text size="body" weight="medium" color="primaryInverted">
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }

                // Render other items as menu items
                return (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        item.onPress();
                        onClose();
                      }}
                      accessibilityRole="button"
                    >
                      {item.icon && (
                        <View style={styles.menuItemIcon}>
                          <Icon
                            name={item.icon}
                            size={22}
                            color={colors.textSecondary}
                          />
                        </View>
                      )}
                      <Text size="body" weight="medium" color="primary">
                        {item.label}
                      </Text>
                      <View style={styles.chevron}>
                        <Icon
                          name="CaretRightIcon"
                          size={20}
                          color={colors.brandPrimary}
                        />
                      </View>
                    </TouchableOpacity>
                    {item.showDivider && <View style={styles.divider} />}
                  </React.Fragment>
                );
              })}
            </View>

            {/* Bottom Selectors */}
            <View style={styles.bottomSelectors}>
              <TouchableOpacity style={styles.selector} accessibilityRole="button">
                <Text size="body" weight="medium" color="primary">
                  English
                </Text>
                <Icon
                  name="CaretUpDownIcon"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.selector} accessibilityRole="button">
                <Text size="body" weight="medium" color="primary">
                  United Kingdom
                </Text>
                <Icon
                  name="CaretUpDownIcon"
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  backdropOverlay: {
    backgroundColor: colors.backgroundOverlay,
    flex: 1,
  },
  bottomSelectors: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  chevron: {
    marginLeft: 'auto',
  },
  closeButton: {
    padding: 4,
  },
  container: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  divider: {
    backgroundColor: colors.border,
    height: 1,
    marginHorizontal: 20,
  },
  drawer: {
    backgroundColor: colors.background,
    bottom: 0,
    elevation: 10,
    position: 'absolute',
    right: 0,
    top: 0,
    width: SCREEN_WIDTH,
  },
  drawerContent: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  itemsContainer: {
    flex: 1,
    paddingTop: 8,
  },
  logo: {
    height: 36,
    width: 120,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemIcon: {
    marginRight: 16,
  },
  selector: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  signInButton: {
    alignItems: 'center',
    backgroundColor: colors.brandPrimary,
    borderRadius: 4,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 14,
  },
});
