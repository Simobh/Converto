import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({ selector: 'app-login', templateUrl: './login.component.html' })
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}
  login() { this.authService.login(this.email, this.password); }
}
