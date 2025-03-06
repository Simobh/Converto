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

@Injectable({ providedIn: 'root' })
export class AuthService {

  private userState = new BehaviorSubject<User | null>(null);
  user$ = this.userState.asObservable();

  constructor(private auth: Auth, private router: Router) {
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
      .catch((error) => {
        alert("Erreur d'inscription: " + error.message);
      });
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          this.router.navigate(['/home']);
        } else {
          alert("Merci de vérifier votre email avant de vous connecter.");
          this.logout();
        }
      })
      .catch(() => {
        alert("Email ou mot de passe invalide !");
      });
  }

  logout() {
    signOut(this.auth)
      .then(() => this.router.navigate(['/login']))
      .catch(error => console.error("Erreur de déconnexion:", error.message));
  }

  resetPassword(email: string) {
    sendPasswordResetEmail(this.auth, email)
      .then(() => {
        alert('Email de réinitialisation envoyé !');
      })
      .catch((error) => {
        alert("Erreur: " + error.message);
      });
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
