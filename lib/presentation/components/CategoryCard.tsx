import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from '@/lib/presentation/ui/text.ui';
import { useTheme } from '@/lib/application/context/ThemeContext';
import { SPACING, CARD_RADIUS } from '@/lib/presentation/styles/variables.style';
import type { CategoryWithSpent } from '@/lib/types';

interface CategoryCardProps {
  category: CategoryWithSpent;
  onPress: () => void;
  headerPaddingRight?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress, headerPaddingRight = 0 }) => {
  const { theme } = useTheme();
  const progress = category.budget > 0 ? Math.min(category.spent / category.budget, 1) : 0;
  const isOver = category.budget > 0 && category.spent > category.budget;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.container, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow }]}>
        <View style={[styles.header, headerPaddingRight > 0 && { paddingRight: headerPaddingRight }]}>
          <View style={[styles.iconDot, { backgroundColor: category.color + '22' }]}>
            <View style={[styles.innerDot, { backgroundColor: category.color }]} />
          </View>
          <View style={styles.nameSection}>
            <Text textThemeName="title" numberOfLines={1}>{category.name}</Text>
            <Text textThemeName="caption" style={{ color: theme.colors.textMuted }}>
              {category.percentage.toFixed(1)}% of spending
            </Text>
          </View>
          <View style={styles.amountSection}>
            <Text textThemeName="bodyBold" style={{ color: theme.colors.text }}>
              ৳{Math.round(category.spent)}
            </Text>
            {category.budget > 0 && (
              <Text textThemeName="caption" style={{ color: theme.colors.textMuted }}>
                ৳{Math.round(category.budget)}
              </Text>
            )}
          </View>
        </View>

        {category.budget > 0 && (
          <View style={styles.progressSection}>
            <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceSecondary }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress * 100}%`,
                    backgroundColor: isOver ? theme.colors.error : category.color,
                  },
                ]}
              />
            </View>
            {isOver && (
              <Text textThemeName="caption" style={{ color: theme.colors.error }}>
                Over budget by ৳{Math.round(category.spent - category.budget)}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: CARD_RADIUS,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    gap: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  nameSection: {
    flex: 1,
    gap: 2,
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  progressSection: {
    gap: 4,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
