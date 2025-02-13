import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({ selector: 'app-signup', templateUrl: './signup.component.html' })
export class SignupComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}
  signUp() { this.authService.signUp(this.email, this.password); }
}
