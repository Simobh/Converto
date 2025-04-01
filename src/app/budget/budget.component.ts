import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit {
  isAuthenticated = false;
  own_currency !: string;
  budget !: number;
  destination !: string;
  depense !: {depense_type : string, estimated_depense : number, converted_cost : number}[];
  total !: number;
  expenses: any[] = [{}];
  alert_message !: string;

  ngOnInit() {

  }

  addExpense(): void {
    this.expenses.push({});
  }

  removeExpense(index: number): void {
    this.expenses.splice(index, 1);
  }

}
