export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  budget: number;
  createdAt: string;
}

export interface CategoryWithSpent extends Category {
  spent: number;
  percentage: number;
}
