import React, { useMemo } from 'react';
import * as Phosphor from 'phosphor-react-native';

import { useColors } from '@theme';

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
  color: colorProp,
  weight = 'regular',
  mirrored = false,
}: IconProps) {
  const colors = useColors();
  const color = useMemo(() => colorProp ?? colors.textPrimary, [colorProp, colors.textPrimary]);

  const IconComponent = Phosphor[name];

  return (
    <IconComponent size={size} color={color} weight={weight} mirrored={mirrored} />
  );
}
