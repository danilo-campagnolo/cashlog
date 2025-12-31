export type Expense = {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
};
