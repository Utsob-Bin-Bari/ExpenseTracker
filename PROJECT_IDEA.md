# ExpenseTracker — Project Idea

## Concept
A personal expense tracking app that helps users monitor their spending across categories with budget management and visual insights.

## Target Users
Individual / personal use — one person managing their own finances locally on device.

## Core Features
- **Expenses** — Add, edit, delete expenses. Each expense has: amount, description, category, date.
- **Categories** — Create custom categories with a name, color, and icon. Assign a monthly budget to each.
- **Budget tracking** — Visual progress bar showing how much of each category's budget has been spent.
- **Pie chart** — Visual breakdown of spending percentage per category.
- **Dashboard** — Total spending summary, pie chart, and recent expense list.

## Technical Scope
- **Local only** — No backend, no auth, no network calls.
- **Persistence** — AsyncStorage via Zustand persist middleware.
- **Architecture** — Layered (DDD-inspired): types / application / infrastructure / presentation.
- **Icons** — HugeIcons (`@hugeicons/react-native`).
- **Charts** — Custom SVG pie chart using `react-native-svg`.
- **Forms** — `react-hook-form` + `zod` validation.

## Screens
1. **Home** — Pie chart, total spent, recent expenses list.
2. **Categories** — Category cards with budget progress, manage (add/edit/delete).
3. **Add/Edit Expense** — Amount, description, category picker, date.
4. **Add/Edit Category** — Name, color picker, icon picker, budget amount.
