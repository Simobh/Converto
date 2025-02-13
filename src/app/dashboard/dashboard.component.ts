import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({ selector: 'app-dashboard', templateUrl: './dashboard.component.html' })
export class DashboardComponent {
  nom: string = '';
  prenom: string = '';
  email: string = '';
  users: any[] = [];

  constructor(private authService: AuthService, private firestoreService: FirestoreService) {}

  addUser() {
    console.log('Valeurs avant ajout:', this.nom, this.prenom, this.email); // Debugging

    if (this.nom.trim() && this.prenom.trim() && this.email.trim()) {
      const newUser = { nom: this.nom, prenom: this.prenom, email: this.email };
      this.firestoreService.addUser(newUser)
        .then(() => {
          console.log('Utilisateur ajouté avec succès !');
          this.nom = this.prenom = this.email = ''; // Réinitialiser le formulaire
          this.fetchUsers();
        })
        .catch(error => console.error('Erreur Firestore :', error));
    } else {
      console.warn('Tous les champs sont obligatoires');
    }
  }

  fetchUsers() {
    this.firestoreService.getUsers().then(data => {
      this.users = data;
      console.log('Utilisateurs Firestore récupérés :', this.users);
    });
  }

  logout() { this.authService.logout(); }
}
