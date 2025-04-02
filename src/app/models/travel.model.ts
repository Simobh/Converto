import { Expense } from './expense.model';

export interface Travel {
  id?: string;
  currency: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  budget: number;
  expenses: Expense[];
  createdAt: Date;
}
