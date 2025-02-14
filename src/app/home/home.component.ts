import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  currencies: string[] = [];
  baseCurrency: string = '';
  targetCurrency: string = '';
  amount: number = 0;
  convertedAmount: number = 0;
  date: string = new Date().toISOString().split('T')[0];

  constructor(private apiService : ApiService) {}

  ngOnInit() {
    this.apiService.getAllCurrencies().subscribe(data => {
      this.currencies = Object.keys(data); // Récupérer la liste des devises
    });
  }

  convertFrom() {
    if(this.baseCurrency && this.targetCurrency && this.date && this.amount)
    this.apiService.getConvertionRate(this.baseCurrency, this.targetCurrency, this.date, this.amount).subscribe(data => {
      if (data && data.result) {
        this.convertedAmount = data.result;
      }
    });
  }

  convertTo() {
    if(this.targetCurrency && this.baseCurrency && this.date && this.convertedAmount)
    this.apiService.getConvertionRate(this.targetCurrency, this.baseCurrency, this.date, this.convertedAmount).subscribe(data => {
      if (data && data.result) {
        this.amount = data.result;
      }
    });
  }

}
