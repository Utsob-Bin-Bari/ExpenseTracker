# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

ExpenseTracker is a **local-only** personal expense tracker built with Expo (React Native, new architecture enabled). There is no backend, no auth, and no network calls — all state persists to device via AsyncStorage. See [PROJECT_IDEA.md](PROJECT_IDEA.md) for the product concept.

## Commands

Package manager is **yarn** (see `yarn.lock`).

```bash
yarn start              # Expo dev server
yarn ios                # build + run on iOS (dev client)
yarn android            # build + run on Android (dev client)
yarn web                # run in browser
yarn type-check         # tsc --noEmit — run this to verify types
yarn lint               # expo lint (eslint-config-expo)

yarn clean-prebuild     # expo prebuild --clean (regenerate native dirs)
yarn ios-release        # release-configuration iOS build
```

This project uses `expo-dev-client`, so `yarn start` requires a development build on the device/simulator (Expo Go will not work). There is no test runner configured.

## Architecture

The codebase follows a **layered (DDD-inspired)** structure. The router lives in `app/`; all real code lives in `lib/`.

### `app/` is navigation only
`app/` uses **expo-router** file-based routing with **typed routes** enabled. Route files are intentionally thin — they import and re-export a screen component from `lib/presentation/screens/`. Example: `app/(tabs)/index.tsx` is just `export default HomeScreen`. Do **not** put screen logic in `app/`.

- `app/_layout.tsx` — root: mounts `Providers`, the navigation `Stack`, and runs `purgeOldExpenses()` on launch.
- `app/(tabs)/` — bottom-tab screens (Home, Categories).
- `app/(modals)/` — add/edit screens for expenses and categories.

### `lib/` layers
- `lib/types/` — domain interfaces (`Expense`, `Category`, `CategoryWithSpent`). Import via the `@/lib/types` barrel.
- `lib/application/` — state and cross-cutting concerns:
  - `store/` — **Zustand** stores (`expenseStore`, `categoryStore`), each wrapped in `persist` + `createJSONStorage(AsyncStorage)`. Stores hold raw CRUD only; derived values (spending, percentages) are computed in screens/components.
  - `context/` + `providers/` — React context definitions live in `context/`, their provider implementations in `providers/`. `providers/index.tsx` composes the provider tree (`ThemeProvider` → `OnlineManagerProvider` → `KeyboardProvider` + `FlashMessageWrapper`).
  - `validators/` — **Zod** schemas + inferred form DTO types.
- `lib/infrastructure/utils/` — pure functions, no React (`budget.ts`, `date.ts`).
- `lib/presentation/` — everything visual: `screens/`, `components/`, `ui/` (primitives: `button`, `input`, `text`), `hooks/`, `styles/`, `wrappers/`.

### Forms
Forms use **react-hook-form** + **zod** (`@hookform/resolvers/zod`). The pattern is a hook per entity (`useExpenseForm`, `useCategoryForm`) that takes an optional `existing` record, wires up `defaultValues`, and on submit calls the store action, `router.back()`, and `showMessage()` (react-native-flash-message). The same hook handles both add and edit via `isEditing: !!existing`.

### Theming
`useTheme()` (from `@/lib/application/context/ThemeContext`) exposes `theme`, `isDark`, and `toggleTheme`. Theme mode is persisted to AsyncStorage separately from the stores. Pull colors/spacing from `theme.colors`, `lib/presentation/styles/variables.style`, etc. — avoid hardcoding colors. `useTheme` throws if used outside `ThemeProvider`.

### Budgets (non-obvious)
Categories support **per-month budgets**. `Category.monthlyBudgets` is a `Record<'YYYY-MM', number>` overriding the baseline `Category.budget`. Always resolve the effective budget through `resolveMonthlyBudget(category, monthKey)` in `lib/infrastructure/utils/budget.ts`, which: (1) uses an explicit override for that month, else (2) inherits the most recent prior month's override, else (3) falls back to baseline `budget`. Month keys are `'YYYY-MM'` strings and rely on **lexicographic === chronological** ordering. Use `toMonthKey()` / `trailingMonths()` from `date.ts` to generate them.

### Data retention
`expenseStore.purgeOldExpenses()` (called once on app launch in the root layout) drops any expense older than the trailing 12-month window. The app only ever reasons about the last 12 months.

## Conventions

- **Path alias**: `@/*` maps to the repo root (`tsconfig.json`). Import as `@/lib/...`.
- **TypeScript is strict** with `noUncheckedIndexedAccess` — indexed access yields `T | undefined`. Existing code uses the `!` non-null assertion when an index is known-safe (e.g. `arr[0]!`); match that style.
- **Icons**: HugeIcons via `<HugeiconsIcon icon={...} />` from `@hugeicons/react-native` + `@hugeicons/core-free-icons`.
- **SVG**: imported as components via `react-native-svg-transformer` (configured in `metro.config.js`); the pie chart is hand-built with `react-native-svg`.
- **IDs**: generated inline as `` `${Date.now()}-${Math.random().toString(36).slice(2)}` `` inside store actions.
- **Reanimated**: `react-native-reanimated/plugin` must remain the last Babel plugin.