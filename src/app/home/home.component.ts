import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { ViewChild, ElementRef , OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent  implements OnInit {

  currencies: string[] = [];
  baseCurrency: string = '';
  targetCurrency: string = '';
  amount: number = 0;
  convertedAmount: number = 0;
  date: string = new Date().toISOString().split('T')[0];

  sellPrice: number = 0;
  buyPrice: number = 0;

  labels: string[] = [];
  data: number[] = [];

  isAuthenticated = false;

  constructor(private authService: AuthService,private apiService : ApiService) {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnInit() {
    this.apiService.getAllCurrencies().subscribe(data => {
      this.currencies = Object.keys(data);
    });
  }

  convert(type: string) {

    if(this.baseCurrency && this.targetCurrency && this.date && this.amount && type=='amount1')
    this.apiService.getConvertionRate(this.baseCurrency, this.targetCurrency, this.date, this.amount).subscribe(data => {
      if (data && data.result) {
        this.convertedAmount = data.result;
      }
    });

    if(this.targetCurrency && this.baseCurrency && this.date && this.convertedAmount && type=='amount2')
      this.apiService.getConvertionRate(this.targetCurrency, this.baseCurrency, this.date, this.convertedAmount).subscribe(data => {
        if (data && data.result) {
          this.amount = data.result;
        }
      });

      if(this.baseCurrency && this.targetCurrency){
        this.labels = this.getDaysOfMonth();
        this.data = this.getCurrencyData();

        this.apiService.getConvertionRate(this.baseCurrency, this.targetCurrency, this.date, 1).subscribe(data => {
          if (data && data.info.rate) {
            this.sellPrice = data.info.rate * (1 + 0.05);
            this.buyPrice = data.info.rate * (1 - 0.05);
          }
        });

      }else{
        this.labels = [];
        this.data = [];
        this.sellPrice = 0;
            this.buyPrice = 0;
      }
  }



  getDaysOfMonth(): string[] {
    return Array.from({ length: 30 }, (_, i) => (i + 1).toString());
  }


  getCurrencyData(): number[] {
    let value = 100;
    return Array.from({ length: 30 }, () => {
      value += (Math.random() - 0.5) * 5;
      return parseFloat(value.toFixed(2));
    });
  }

}
