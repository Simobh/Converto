import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, collectionData  } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { map, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  getUserUID(): Observable<string | null> {
    return authState(this.auth).pipe(
      map(user => user ? user.uid : null)
    );
  }
  
  addFavoriteCurrency(baseCurrency: string, targetCurrency: string) {
    return this.getUserUID().pipe(
      switchMap(uid => {
        if (uid) {
          const userFavoritesCollection = collection(this.firestore, `users/${uid}/favorites`);
          return addDoc(userFavoritesCollection, {
            baseCurrency,
            targetCurrency,
            addedAt: new Date()
          });
        } else {
          return of(null);
        }
      })
    );
  }

  getUserFavorites(): Observable<any[]> {
    return this.getUserUID().pipe(
      switchMap(uid => {
        if (!uid) return of([]); // Si l'utilisateur n'est pas connecté, on retourne une liste vide

        const userFavoritesCollection = collection(this.firestore, `users/${uid}/favorites`);
        return collectionData(userFavoritesCollection, { idField: 'id' }); // Retourne les données Firestore avec l'ID
      })
    );
  }

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
