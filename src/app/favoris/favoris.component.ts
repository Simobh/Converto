import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';
import { ApiService } from '../services/api.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-favoris',
  templateUrl: './favoris.component.html',
  styleUrls: ['./favoris.component.css']
})
export class FavorisComponent implements OnInit {

  isAuthenticated = false;
  favoris: any[] = []; 
  todayRate =0;
  yesterdayRate = 0;
  dashbord: {from : string, to : string, rate : number, labels : string[], data : number[]}[] = [];

  constructor(private authService: AuthService, private fireStoreService: FirestoreService, private apiService : ApiService) {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.fireStoreService.getUserFavorites().subscribe(favorites => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
  
      const todayStr = today.toISOString().split('T')[0];
      const yesterdayStr = yesterday.toISOString().split('T')[0];
  
      favorites.forEach(fav => {
        const from = fav.baseCurrency;
        const to = fav.targetCurrency;
  
        // Utilisation de forkJoin pour exécuter les requêtes en parallèle et attendre leur résolution
        forkJoin({
          todayRate: this.apiService.getConvertionRate(from, to, todayStr, 1),
          yesterdayRate: this.apiService.getConvertionRate(from, to, yesterdayStr, 1)
        }).subscribe(({ todayRate, yesterdayRate }) => {
          if (todayRate && todayRate.result && yesterdayRate && yesterdayRate.result) {
            const rateDifference = todayRate.result - yesterdayRate.result;
  
            this.dashbord.push({
              from,
              to,
              rate: rateDifference,
              labels: this.getDaysOfMonth(),
              data: this.getCurrencyData()
            });
          }
        });
      });
    });
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

  logout() {
    this.authService.logout();
  }

}
