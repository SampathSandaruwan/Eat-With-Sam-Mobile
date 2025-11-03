import React, { useMemo } from 'react';
import { StyleProp, Text as RNText, TextStyle } from 'react-native';

import { colors } from '@theme';

type Props = {
    size?: 'small' | 'body' | 'heading1' | 'heading2',
    weight?: 'regular' | 'medium' | 'bold' | 'bolder',
    children: React.ReactNode;
    color?: 'primary' | 'secondary' | 'brandColor' | 'inactive' | 'primaryInverted' | 'danger';
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
      default: return 14;
    }
  }, [size]);
  const fontWeight = useMemo(() => {
    switch (weight) {
      case 'regular': return '400';
      case 'medium': return '600';
      case 'bold': return '700';
      case 'bolder': return '800';
      default: return '400';
    }
  }, [weight]);
  const color = useMemo(() => {
    switch (colorProp) {
      case 'primary': return colors.textPrimary;
      case 'secondary': return colors.textSecondary;
      case 'brandColor': return colors.brandYellow;
      case 'inactive': return colors.textInactive;
      case 'primaryInverted': return colors.background;
      case 'danger': return colors.danger;
      default: return colors.textPrimary;
    }
  }, [colorProp]);

  return (
    <RNText
      style={[
        { fontSize },
        { fontWeight },
        { color },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
}
