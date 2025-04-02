import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email = '';
  password = '';
  name ='';

  constructor(private authService: AuthService, private alertService : AlertService) {}

  validatePassword(password: string): boolean {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
  }

  signUp() {
    if (!this.validatePassword(this.password)) {
      this.alertService.showAlert('Le mot de passe doit contenir au moins 8 caractères, des lettres et des chiffres', 'error');
      return;
    }
    this.authService.signUp(this.email, this.password);
  }
}
