import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<{ message: string, type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  alert$ = this.alertSubject.asObservable();

  showAlert(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    this.alertSubject.next({ message, type });

    // Disparition automatique après 3 secondes
    setTimeout(() => {
      this.alertSubject.next(null);
    }, 3000);
  }
}
