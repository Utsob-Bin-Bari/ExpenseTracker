import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Providers } from '@/lib/application/providers';
import { useExpenseStore } from '@/lib/application/store/expenseStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const purgeOldExpenses = useExpenseStore((s) => s.purgeOldExpenses);

  useEffect(() => {
    SplashScreen.hideAsync();
    purgeOldExpenses();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Providers>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(modals)" />
          </Stack>
        </Providers>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
