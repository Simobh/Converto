import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  GoogleAuthProvider,
  User,
  onAuthStateChanged
} from '@angular/fire/auth';
import { signInWithPopup } from '@firebase/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from '../services/alert.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userState = new BehaviorSubject<User | null>(null);
  user$ = this.userState.asObservable();

  constructor(private auth: Auth, private router: Router, private alertService : AlertService) {
    onAuthStateChanged(this.auth, (user) => {
      this.userState.next(user);
    });
  }

  signUp(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(user)
          .then(() => {
            alert("Un email de vérification a été envoyé. Vérifie ta boîte mail !");
            this.router.navigate(['/login']);
          })
          .catch(error => console.error("Erreur d'envoi du mail:", error.message));
      })
      .catch((error) =>  {
        if (error.code === 'auth/email-already-in-use') {
          this.alertService.showAlert('Cette adresse email est déjà utilisée', 'error');
        } else {
          this.alertService.showAlert('Une erreur est survenue lors de l\'inscription', 'error');
        }
      });
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          this.router.navigate(['/home']);
        } else {
          this.alertService.showAlert("Merci de vérifier votre email avant de vous connecter", 'info');
          this.logout();
        }
      })
      .catch(() => {
        this.alertService.showAlert("Email ou mot de passe invalide !", 'error');
      });
  }

  logout() {
    signOut(this.auth)
      .then(() => this.router.navigate(['/login']))
      .catch(error => console.error("Erreur de déconnexion:", error.message));
  }


  resetPassword(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }
  

  signWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider())
      .then(res => {
        this.router.navigate(['/home']);
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      })
      .catch(err => {
        alert("Erreur Google Sign-In: " + err.message);
      });
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }
}
