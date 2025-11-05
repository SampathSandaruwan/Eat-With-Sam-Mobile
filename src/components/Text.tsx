import React, { useMemo } from 'react';
import { StyleProp, Text as RNText, TextStyle } from 'react-native';

import { colors } from '@theme';

type FontWeight =
  | 'light'
  | 'regular'
  | 'medium'
  | 'semiBold'
  | 'bold';

type FontSize =
  | 'small'
  | 'body'
  | 'heading1'
  | 'heading2'
  | 'large'
  | 'veryLarge';

type FontColor =
  | 'primary'
  | 'secondary'
  | 'brandColor'
  | 'inactive'
  | 'primaryInverted'
  | 'danger'
  | 'success'
  | 'attention';

type Props = {
    size?: FontSize,
    weight?: FontWeight,
    children: React.ReactNode;
    color?: FontColor;
    style?: StyleProp<TextStyle>;
    numberOfLines?: number;
};

export default function Text({
  size,
  weight,
  children,
  color: colorProp,
  style,
  numberOfLines,
}: Props) {
  const fontSize = useMemo(() => {
    switch (size) {
      case 'small': return 12;
      case 'body': return 14;
      case 'heading1': return 16;
      case 'heading2': return 18;
      case 'large': return 24;
      case 'veryLarge': return 28;
      default: return 14;
    }
  }, [size]);
  const fontFamily = useMemo(() => {
    switch (weight) {
      case 'light': return 'IBMPlexSans-Light';
      case 'regular': return 'IBMPlexSans-Regular';
      case 'medium': return 'IBMPlexSans-Medium';
      case 'semiBold': return 'IBMPlexSans-SemiBold';
      case 'bold': return 'IBMPlexSans-SemiBold';
      default: return 'IBMPlexSans-Regular';
    }
  }, [weight]);
  const color = useMemo(() => {
    switch (colorProp) {
      case 'primary': return colors.textPrimary;
      case 'secondary': return colors.textSecondary;
      case 'brandColor': return colors.brandPrimary;
      case 'inactive': return colors.textInactive;
      case 'primaryInverted': return colors.background;
      case 'danger': return colors.danger;
      case 'success': return colors.success;
      case 'attention': return colors.attention;
      default: return colors.textPrimary;
    }
  }, [colorProp]);

  return (
    <RNText
      style={[
        { fontSize },
        { fontFamily },
        { color },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}
