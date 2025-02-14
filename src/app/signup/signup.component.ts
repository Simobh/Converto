import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({ 
  selector: 'app-signup', 
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email = '';
  password = '';
  name ='';

  constructor(private authService: AuthService) {}
  signUp() { this.authService.signUp(this.email, this.password); }
}
