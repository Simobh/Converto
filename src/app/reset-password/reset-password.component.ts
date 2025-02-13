import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email = '';
  errorMessage = '';

  constructor(private authService: AuthService) {}

  resetPassword() {
    if (!this.email.includes('@')) {
      this.errorMessage = "Veuillez entrer une adresse email valide.";
      return;
    }
    this.authService.resetPassword(this.email);
  }
}
