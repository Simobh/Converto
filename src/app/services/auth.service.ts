import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private auth: Auth, private router: Router) {}

  signUp(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // ✅ Envoyer un email de vérification après l'inscription
        sendEmailVerification(user)
          .then(() => {
            alert("Un email de vérification a été envoyé. Vérifie ta boîte mail !");
            this.router.navigate(['/login']); // Redirection vers la page de connexion
          })
          .catch(error => console.error("Erreur lors de l'envoi du mail de vérification:", error.message));
      })
      .catch((error) => {
        console.error("Erreur d'inscription:", error.message);
      });
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // ✅ Vérifier si l'utilisateur a validé son email avant d'autoriser l'accès
        if (user.emailVerified) {
          this.router.navigate(['/dashboard']);
        } else {
          alert("Merci de vérifier votre email avant de vous connecter.");
          this.logout(); // Déconnexion forcée si l'email n'est pas vérifié
        }
      })
      .catch((error) => {
        console.error("Erreur de connexion:", error.message);
      });
  }

  logout() {
    signOut(this.auth)
      .then(() => this.router.navigate(['/login']))
      .catch(error => console.error("Erreur lors de la déconnexion:", error.message));
  }

  resetPassword(email: string) {
    try {
      sendPasswordResetEmail(this.auth, email);
      alert('Email de réinitialisation envoyé !');
    } catch (error) {
      alert("Erreur: " + (error as any).message);
    }
  }
}
