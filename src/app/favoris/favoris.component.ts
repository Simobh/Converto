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
  dashbord: {id: string, from: string, to: string, rate: number, labels: string[], data: number[]}[] = [];

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
    this.dashbord = [];
    this.displayedDashboard = [];

    this.fireStoreService.getUserFavorites().subscribe(favorites => {
      if (!favorites || favorites.length === 0) return;

      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      const requests = favorites.map(fav =>
        forkJoin({
          todayRate: this.apiService.getConvertionRate(fav.baseCurrency, fav.targetCurrency, todayStr, 1),
          yesterdayRate: this.apiService.getConvertionRate(fav.baseCurrency, fav.targetCurrency, yesterdayStr, 1)
        })
      );

      forkJoin(requests).subscribe(results => {
        results.forEach((res, index) => {
          if (res.todayRate?.result && res.yesterdayRate?.result) {
            const rateDifference = res.todayRate.result - res.yesterdayRate.result;

            const favorite = favorites[index];
            const alreadyExists = this.dashbord.some(item =>
              item.from === favorite.baseCurrency && item.to === favorite.targetCurrency
            );

            if (!alreadyExists) {
              this.dashbord.push({
                id: favorite.id || 'unknown-id',
                from: favorite.baseCurrency,
                to: favorite.targetCurrency,
                rate: rateDifference,
                labels: this.getDaysOfMonth(),
                data: [] // Initialisation vide, sera rempli après
              });
            }
          }
        });

        this.displayedDashboard = this.dashbord.slice(0, this.itemsToShow);

        // Chargement des données historiques après la mise à jour du dashboard
        this.dashbord.forEach(item => {
          this.getHistoricalData(item);
        });
      });
    });
  }

  getHistoricalData(item: { id: string, from: string, to: string, rate: number, labels: string[], data: number[] }) {
    const dates = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1); // Fixer à un mois en arrière

    while (startDate <= endDate) {
      dates.push(startDate.toISOString().split('T')[0]);
      startDate.setDate(startDate.getDate() + 1);
    }

    const requests = dates.map(date =>
      this.apiService.getConvertionRate(item.from, item.to, date, 1)
    );

    forkJoin(requests).subscribe(results => {
      item.data = results.map(result => result?.result || 0);
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

  deleteFavorite(favoriteId: string) {
    this.fireStoreService.deleteFavorite(favoriteId).subscribe({
      next: () => {
        this.loadFavorites();
      },
      error: (error) => {
        console.error('Error deleting favorite:', error);
      }
    });
  }
}
