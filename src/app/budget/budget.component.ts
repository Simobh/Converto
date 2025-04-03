import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute } from '@angular/router';

import { Expense } from '../models/expense.model';
import { Travel } from '../models/travel.model';

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
  departureDate: string = '';
  budget: number | null = null;
  days !: number ;
  isAuthenticated = false;

  expenses: Expense[] = [
    { description: '', cost: null, convertedCost: null }
  ];


  showErrorMessage: boolean = false;

  blockTypingIfFormIncomplete(event: KeyboardEvent) {
    if (!this.isFormComplete()) {
      event.preventDefault();
      this.showErrorMessage = true;
    }
  }

  isFormComplete(): boolean {
    return !!(this.currency && this.destination && this.departureDate && this.returnDate);
  }

  triggerErrorIfFormIncomplete() {
    if (!this.isFormComplete()) {
      this.showErrorMessage = true;
    }
  }

  isBudgetRespected(): boolean{
    if(this.budget) return this.total < this.budget;
    else return true;
  }

  ngOnInit() {
    this.apiService.getAllCurrencies().subscribe(data => {
      this.currencies = Object.keys(data);
    });
    this.apiService.getCountries().subscribe(data => {
      this.countries = data;
    });

    this.route.queryParams.subscribe(params => {
      if (params['currency']) {
        this.currency = params['currency'];
        this.setCurrencyImage();
      }
      if (params['destination']) {
        this.destination = params['destination'];
        this.setCountryImage();
      }
      if (params['departureDate']) {
        this.departureDate = params['departureDate'];
      }
      if (params['returnDate']) {
        this.returnDate = params['returnDate'];
      }
      if (params['budget']) {
        this.budget = Number(params['budget']);
      }
      if (params['expenses']) {
        this.expenses = JSON.parse(params['expenses']);
      }

      if (this.departureDate && this.returnDate) {
        this.setPeriod();
      }
      if (this.currency && this.destination) {
        this.convertAllCosts();
      }
    });
  }

  constructor(
    private authService: AuthService,
    private fireStoreService: FirestoreService,
    private apiService: ApiService,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }


  formatBudget() {
    if (this.budget !== null && this.budget !== undefined) {
      this.budget = parseFloat(this.budget.toFixed(2));
    }
  }

  setCurrencyImage(){
    this.imageUrl =`../../assets/flags/ic_flag_${this.currency.toLowerCase()}.png`
  }

  setCountryImage(){
    this.flagUrl =`../../assets/flags/ic_flag_${this.destination.toLowerCase()}.png`
  }

  setMinDate(){
    return (this.departureDate) ? this.departureDate : this.currentDate;
  }

  get dailyBudget(): number | null {
    return this.budget && this.days ? this.budget / this.days : null;
  }

  setPeriod(){
    if(this.departureDate && this.returnDate){
      var date1 = new Date(this.departureDate);
      var date2 = new Date(this.returnDate);
      var differenceInTime = date2.getTime() - date1.getTime();
      this.days = differenceInTime / (1000 * 3600 * 24) + 1;
    }
  }

  addExpense() {
    this.expenses.push({ description: '', cost: null, convertedCost: null });
  }

  removeExpense(index: number) {
    this.expenses.splice(index, 1);
    if(this.expenses.length < 1) this.addExpense();
  }


  get total(): number {
    return this.expenses.reduce((sum, exp) => sum + (exp.cost || 0), 0);
  }

  get totalConverted(): number {
    return this.expenses.reduce((sum, exp) => sum + (exp.convertedCost || 0), 0);
  }

  logout() {
    this.authService.logout();
  }

  saveBudget() {
    if (!this.currency || !this.destination || !this.departureDate || !this.returnDate || !this.budget) {
      this.alertService.showAlert('Veuillez remplir tous les champs obligatoires', 'error');
      return;
    }

    const travelData: Travel = {
      currency: this.currency,
      destination: this.destination,
      departureDate: this.departureDate,
      returnDate: this.returnDate,
      budget: this.budget,
      expenses: this.expenses,
      createdAt: new Date()
    };

    this.fireStoreService.saveTravel(travelData).subscribe({
      error: (err) => this.alertService.showAlert('Erreur lors de la sauvegarde', 'error')
    });
  }

  convertCost(expense: Expense) {
    if (expense.cost && this.currency  && this.destination) {
      this.apiService.getConvertionRate(this.currency, this.destination, this.currentDate, expense.cost).subscribe(data => {
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
          this.currency,
          this.destination,
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
