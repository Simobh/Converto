
import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { AlertService } from '../services/alert.service';
import { ViewChild, ElementRef , OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent  implements OnInit {

  email: string = ''

  currencies: string[] = [];
  baseCurrency: string = '';
  targetCurrency: string = '';
  amount: number = 0;
  convertedAmount: number = 0;
  date: string = new Date().toISOString().split('T')[0];

  baseImageUrl:string = "";
  targetImageUrl:string = "";

  sellPrice: number = 0;
  buyPrice: number = 0;

  labels: string[] = [];
  data: number[] = [];

  selectedPeriod: number = 30;

  isAuthenticated = false;

  constructor(private authService: AuthService,private apiService : ApiService, private fireStoreService : FirestoreService, private alertService : AlertService) {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        this.email = user.email || '';
      }
    });
  }

  ngOnInit() {
    this.apiService.getAllCurrencies().subscribe(data => {
      this.currencies = Object.keys(data);
    });
  }

  convert(type: string) {

    if(this.baseCurrency) this.baseImageUrl=`../../assets/flags/ic_flag_${this.baseCurrency.toLowerCase()}.png`
    if(this.targetCurrency) this.targetImageUrl=`../../assets/flags/ic_flag_${this.targetCurrency.toLowerCase()}.png`

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
        this.getHistoricalData();

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
    const days = [];
    const currentDate = new Date();

    for (let i = 0; i < this.selectedPeriod; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      days.unshift(`${day}/${month}`);
    }

    return days;
  }

  getHistoricalData() {
    const dates = [];
    const endDate = new Date();

    for (let i = 0; i < this.selectedPeriod; i++) {
      const date = new Date(endDate);
      date.setDate(endDate.getDate() - i);
      dates.unshift(date.toISOString().split('T')[0]);
    }

    const requests = dates.map(date =>
      this.apiService.getConvertionRate(this.baseCurrency, this.targetCurrency, date, 1)
    );

    forkJoin(requests).subscribe(results => {
      this.data = results.map(result => result?.result || 0);
      this.labels = this.getDaysOfMonth();
    });
  }

  addToFavorites() {
    this.fireStoreService.addFavoriteCurrency(this.baseCurrency, this.targetCurrency).subscribe(
      () => {});
  }

  changePeriod(days: number) {
    this.selectedPeriod = days;
    if(this.baseCurrency && this.targetCurrency) {
      this.getHistoricalData();
    }
  }

  swapCurrencies() {
    const tempCurrency = this.baseCurrency;
    const tempAmount = this.amount;
    this.baseCurrency = this.targetCurrency;
    this.targetCurrency = tempCurrency;
    this.amount = this.convertedAmount;
    this.convert('amount1');
  }

  logout() {
    this.authService.logout();
  }

}
