import { Tabs } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Home01Icon, GridIcon, ChartColumnIcon } from '@hugeicons/core-free-icons';
import { useTheme } from '@/lib/application/context/ThemeContext';

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.tabBarBorder,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={Home01Icon} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={GridIcon} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="yearly"
        options={{
          title: 'Yearly',
          tabBarIcon: ({ color, size }) => (
            <HugeiconsIcon icon={ChartColumnIcon} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
