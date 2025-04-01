import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://api.fxratesapi.com';    // URL de FXRatesAPI
  private apiKey = 'fxr_live_7454a50295ce13c3ea994b22fc9a9919e0c1';   // clé API
  constructor(private http : HttpClient) {}

  getAllCurrencies(): Observable <any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`,
    });
    return this.http.get(`${this.apiUrl}/currencies`, { headers });
  }

  getConvertionRate(from: string, to: string, date: string, amount: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.apiKey}`
    });

    return this.http.get(`${this.apiUrl}/convert?from=${from}&to=${to}&date=${date}&amount=${amount}&format=json`, { headers });
  }

  getCountries(): Observable<{ currency: string; country: string }[]> {
    const jsonUrl  = "../../assets/pays.json"
    return this.http.get<{ [key: string]: string }>(jsonUrl).pipe(
      map(currencyObject => {
        // Transformer l'objet en tableau
        return Object.keys(currencyObject).map(key => ({
          currency: key,
          country: currencyObject[key]
        }));
      })
    );
  }

}
