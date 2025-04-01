import { Component, OnInit } from '@angular/core';
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
export class BudgetComponent implements OnInit {
  currencies: string[] = [];
  countries: { currency: string; country: string }[] = [];
  currency : string = '';
  destination: string = '';
  returnDate: string = '';
  imageUrl !: string;
  flagUrl !: string;
  currentDate : string = new Date().toISOString().split('T')[0];
  departureDate: string = this.currentDate;
  budget: number | null = null;
  days: number = 4;
  isAuthenticated = false;

  expenses: Expense[] = [
    { description: '', cost: null, convertedCost: null }
  ];

  ngOnInit() {
    this.apiService.getAllCurrencies().subscribe(data => {
      this.currencies = Object.keys(data);
    });
    this.apiService.getCountries().subscribe(data => {
      this.countries = data;
    });
  }

  constructor(
    private authService: AuthService,
    private fireStoreService: FirestoreService,
    private apiService: ApiService
  ) {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  setCurrencyImage(){
    this.imageUrl =`../../assets/flags/ic_flag_${this.currency.toLowerCase()}.png`
  }

  setCountryImage(){
    this.flagUrl =`../../assets/flags/ic_flag_${this.destination.toLowerCase()}.png`
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
    return this.expenses.reduce((sum, exp) => sum + (exp.convertedCost || 0), 0);
  }

  logout() {
    this.authService.logout();
  }

  convertCost(expense: Expense) {
    if (expense.cost && this.currency  && this.destination) {
      this.apiService.getConvertionRate(this.destination, this.currency, this.currentDate, expense.cost).subscribe(data => {
        if (data && data.result) {
          expense.convertedCost = data.result;
        }
      });
    }
  }

  convertAllCosts(): void {
    if (this.currency  && this.destination && this.expenses) {
    this.expenses.forEach(expense => {
      // Convertit seulement si le coût de base existe
      if (expense.cost && expense.cost > 0) {
        this.apiService.getConvertionRate(
          this.destination, 
          this.currency, 
          this.currentDate, 
          expense.cost
        ).subscribe({
          next: (data) => {
            if (data?.result) {
              expense.convertedCost = data.result;
            }
          },
          error: (err) => console.error('Erreur de conversion:', err)
        });
      }
    });
  }

}

}