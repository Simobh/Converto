import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { AlertService } from '../services/alert.service';


interface Expense {
  description: string;
  cost: number | null;
  convertedCost: number | null;
}

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent {
  currency: string = '';
  destination: string = '';
  departureDate: string = '';
  returnDate: string = '';

  budget: number | null = null;
  days: number = 4;
  isAuthenticated = false;

  expenses: Expense[] = [
    { description: '', cost: null, convertedCost: null },
    { description: '', cost: null, convertedCost: null }
  ];

  constructor(
    private authService: AuthService,
    private fireStoreService: FirestoreService,
    private apiService: ApiService
  ) {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  get dailyBudget(): number | null {
    return this.budget && this.days ? this.budget / this.days : null;
  }

  addExpense() {
    this.expenses.push({ description: '', cost: null, convertedCost: null });
  }

  removeExpense(index: number) {
    this.expenses.splice(index, 1);
  }

  get total(): number {
    return this.expenses.reduce((sum, exp) => sum + (exp.cost || 0), 0);
  }

  logout() {
    this.authService.logout();
  }


  convertCost(expense: Expense) {
    if (expense.cost !== null) {
      expense.convertedCost = expense.cost * 1.1; // exemple conversion fictive
    }
  }
}





