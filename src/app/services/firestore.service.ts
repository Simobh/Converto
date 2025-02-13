import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  // Ajouter un utilisateur
  addUser(user: { nom: string; prenom: string; email: string }) {
    return addDoc(collection(this.firestore, 'users'), user);
  }

  // Récupérer tous les utilisateurs
  async getUsers() {
    const querySnapshot = await getDocs(collection(this.firestore, 'users'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
