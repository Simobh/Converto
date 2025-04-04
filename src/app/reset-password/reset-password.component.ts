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
  successMessage = ''; // ✅ Ajouté

  constructor(private authService: AuthService) {}

  resetPassword() {
    // Vérification basique
    if (!this.email.includes('@')) {
      this.errorMessage = "Veuillez entrer une adresse email valide.";
      this.successMessage = '';
      return;
    }

    // ✅ Appel Firebase via le service (doit retourner une Promise !)
    this.authService.resetPassword(this.email)
      .then(() => {
        this.successMessage = "Email de réinitialisation envoyé ! ";
        this.errorMessage = '';

        // ✅ Le message disparaît après 4 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 4000);
      })
      .catch(error => {
        this.successMessage = '';
        this.errorMessage = "Une erreur est survenue lors de la réinitialisation.";
        console.error(error);
      });
  }
}
