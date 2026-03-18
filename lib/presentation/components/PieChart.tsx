import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Path, Circle } from 'react-native-svg';
import { Text } from '@/lib/presentation/ui/text.ui';
import { useTheme } from '@/lib/application/context/ThemeContext';

export interface PieSlice {
  value: number;
  color: string;
  label: string;
}

interface PieChartProps {
  data: PieSlice[];
  size?: number;
  totalLabel?: string;
  totalAmount?: string;
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle - 90));
  const y1 = cy + r * Math.sin(toRad(startAngle - 90));
  const x2 = cx + r * Math.cos(toRad(endAngle - 90));
  const y2 = cy + r * Math.sin(toRad(endAngle - 90));
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${cx} ${cy} Z`;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  totalLabel = 'Total',
  totalAmount = '',
}) => {
  const { theme } = useTheme();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 8;
  const innerR = size / 2 - 48; // donut hole

  if (total === 0) {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          <Circle cx={cx} cy={cy} r={outerR} fill={theme.colors.surfaceSecondary} />
          <Circle cx={cx} cy={cy} r={innerR} fill={theme.colors.background} />
        </Svg>
        <View style={styles.center}>
          <Text textThemeName="caption" style={{ color: theme.colors.textMuted }}>No data</Text>
        </View>
      </View>
    );
  }

  let startAngle = 0;
  const slices = data
    .filter((d) => d.value > 0)
    .map((d) => {
      const angle = (d.value / total) * 360;
      const path = describeArc(cx, cy, outerR, startAngle, startAngle + angle - 0.5);
      startAngle += angle;
      return { ...d, path };
    });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G>
          {slices.map((slice, i) => (
            <Path key={i} d={slice.path} fill={slice.color} />
          ))}
          <Circle cx={cx} cy={cy} r={innerR} fill={theme.colors.background} />
        </G>
      </Svg>
      <View style={styles.center}>
        <Text textThemeName="caption" style={{ color: theme.colors.textMuted }}>{totalLabel}</Text>
        <Text textThemeName="h4" style={{ color: theme.colors.text }}>{totalAmount}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
