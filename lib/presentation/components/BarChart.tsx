import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/lib/presentation/ui/text.ui';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { SPACING } from '@/lib/presentation/styles/variables.style';

export interface BarDatum {
  label: string;
  value: number;
  highlight?: boolean;
}

interface BarChartProps {
  data: BarDatum[];
  height?: number;
}

const TRACK_HEIGHT = 100;

export const BarChart: React.FC<BarChartProps> = ({ data, height = TRACK_HEIGHT }) => {
  const { theme } = useTheme();
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.container}>
      {data.map((d, i) => {
        const fill = Math.max((d.value / max) * height, d.value > 0 ? 3 : 0);
        return (
          <View key={i} style={styles.col}>
            <View style={[styles.track, { height }]}>
              <View
                style={[
                  styles.bar,
                  {
                    height: fill,
                    backgroundColor: d.highlight ? theme.colors.primary : theme.colors.primaryLight,
                  },
                ]}
              />
            </View>
            <Text
              textThemeName="caption"
              numberOfLines={1}
              style={[styles.label, { color: theme.colors.textMuted }]}
            >
              {d.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  track: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 3,
    minHeight: 0,
  },
  label: {
    fontSize: 9,
  },
});
