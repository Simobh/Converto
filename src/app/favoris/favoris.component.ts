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
  dashbord: {from: string, to: string, rate: number, labels: string[], data: number[]}[] = [];

  displayedDashboard: any[] = [];  // Tableau pour l'affichage progressif
  itemsToShow: number = 5;         // Affiche 5 éléments par défaut
  currentItemsCount: number = 5;   // Suivi du nombre actuel affiché

  constructor(
    private authService: AuthService,
    private fireStoreService: FirestoreService,
    private apiService: ApiService
  ) {
    this.authService.user$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.fireStoreService.getUserFavorites().subscribe(favorites => {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      const requests = favorites.map(fav => forkJoin({
        todayRate: this.apiService.getConvertionRate(fav.baseCurrency, fav.targetCurrency, todayStr, 1),
        yesterdayRate: this.apiService.getConvertionRate(fav.baseCurrency, fav.targetCurrency, yesterdayStr, 1)
      }));

      forkJoin(requests).subscribe(results => {
        results.forEach((res, index) => {
          if (res.todayRate && res.todayRate.result && res.yesterdayRate && res.yesterdayRate.result) {
            const rateDifference = res.todayRate.result - res.yesterdayRate.result;
            this.dashbord.push({
              from: favorites[index].baseCurrency,
              to: favorites[index].targetCurrency,
              rate: rateDifference,
              labels: this.getDaysOfMonth(),
              data: this.getCurrencyData()
            });
          }
        });
        this.displayedDashboard = this.dashbord.slice(0, this.itemsToShow);
      });
    });
  }

  // Méthode d'affichage supplémentaire
  showMore() {
    this.currentItemsCount += this.itemsToShow;
    this.displayedDashboard = this.dashbord.slice(0, this.currentItemsCount);
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
  // Affiche moins d'éléments
showLess() {
  this.currentItemsCount = Math.max(this.itemsToShow, this.currentItemsCount - this.itemsToShow);
  this.displayedDashboard = this.dashbord.slice(0, this.currentItemsCount);
}

  logout() {
    this.authService.logout();
  }
}
