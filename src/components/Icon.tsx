import React from 'react';
import * as Phosphor from 'phosphor-react-native';

import { colors } from '@theme';

export type PhosphorIconName = keyof Omit<typeof Phosphor, 'Icon' | 'IconContext' | 'IconContext' | 'IconWeight'>;

type IconProps = {
    name: PhosphorIconName;
    size?: number;
    color?: string;
    weight?: Phosphor.IconWeight;
    mirrored?: boolean;
};

export default function Icon({
  name,
  size = 24,
  color = colors.textPrimary,
  weight = 'regular',
  mirrored = false,
}: IconProps) {
  const IconComponent = Phosphor[name];

  return (
    <IconComponent size={size} color={color} weight={weight} mirrored={mirrored} />
  );
}
