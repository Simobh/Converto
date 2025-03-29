import { Component, OnInit } from '@angular/core';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  message: string | null = null;
  type: 'success' | 'error' | 'info' | 'warning' | null = null;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertService.alert$.subscribe(alert => {
      if (alert) {
        this.message = alert.message;
        this.type = alert.type;

        // Petite animation pour afficher l'alerte
        setTimeout(() => {
          const alertBox = document.getElementById('custom-alert');
          if (alertBox) {
            alertBox.classList.add('show');
          }
        }, 10);
      } else {
        this.message = null;
        this.type = null;
      }
    });
  }
}
