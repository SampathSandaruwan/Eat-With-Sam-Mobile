import React, { useCallback, useEffect } from 'react';
import { Dimensions, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Icon, PhosphorIconName, Text } from '@components';
import { colors } from '@theme';

const DRAWER_WIDTH = Dimensions.get('window').width * 0.85;
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
  title?: string;
};

export default function RightDrawer({ visible, onClose, items, title = 'Menu' }: Props) {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(DRAWER_WIDTH);
  const opacity = useSharedValue(0);

  const openCloseDrawer = useCallback((open: boolean) => {
    translateX.value = withSpring(
      open ? 0 : DRAWER_WIDTH,
      {
        damping: 40,
        stiffness: 200,
      },
    );
    opacity.value = withTiming(
      open ? 1 : 0,
      { duration: 220 },
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
        translateX.value = Math.min(event.translationX, DRAWER_WIDTH);
        // Adjust opacity based on drawer position
        const progress = Math.min(event.translationX / DRAWER_WIDTH, 1);
        opacity.value = Math.max(0, 1 - progress);
      }
    })
    .onEnd((event) => {
      const shouldClose =
        event.translationX > DRAWER_WIDTH * 0.3 ||
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
        <Animated.View style={[styles.drawer, drawerStyle, { paddingTop: insets.top }]}>
          <View style={styles.drawerContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text size="heading1" weight="bold" color="primary">
                {title}
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Icon name="XIcon" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View style={styles.itemsContainer}>
              {items.map((item, index) => (
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
                          color={colors.textPrimary}
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
                        color={colors.textSecondary}
                      />
                    </View>
                  </TouchableOpacity>
                  {item.showDivider && <View style={styles.divider} />}
                </React.Fragment>
              ))}
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
    shadowColor: colors.backgroundOverlay,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    top: 0,
    width: DRAWER_WIDTH,
  },
  drawerContent: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  itemsContainer: {
    flex: 1,
    paddingTop: 8,
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
});
