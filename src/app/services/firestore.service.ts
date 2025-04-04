import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, collectionData, query, where, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { AlertService } from './alert.service';
import { map, switchMap } from 'rxjs/operators';
import { of, from, throwError, Observable } from 'rxjs';

import { Travel } from '../models/travel.model';
import { Expense } from '../models/expense.model';
import { Favorite } from '../models/favorite.model';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore, private auth: Auth, private alertService : AlertService) {}

  getUserUID(): Observable<string | null> {
    return authState(this.auth).pipe(
      map(user => user ? user.uid : null)
    );
  }

  addFavoriteCurrency(baseCurrency: string, targetCurrency: string) {
    return this.getUserUID().pipe(
      switchMap(uid => {
        if (!uid) {
          return of(null);
        }
        if (!baseCurrency || !targetCurrency) {
          this.alertService.showAlert('Veuillez sélectionner une paire de devises valide', 'error');
          return throwError(() => new Error('Paire de devises invalide'));
        }

        if (baseCurrency == targetCurrency) {
          this.alertService.showAlert('Veuillez choisir deux devises différentes', 'error');
          return throwError(() => new Error('Veuillez choisir deux devises différentes'));
        }

        const userFavoritesCollection = collection(this.firestore, `users/${uid}/favorites`);
        const q = query(
          userFavoritesCollection,
          where('baseCurrency', '==', baseCurrency),
          where('targetCurrency', '==', targetCurrency)
        );

        return from(getDocs(q)).pipe(
          switchMap(querySnapshot => {
            if (!querySnapshot.empty) {
              this.alertService.showAlert('Cette paire de devises est déjà dans vos favoris', 'error');
              return throwError(() => new Error('Déjà dans les favoris'));
            }
            const newFavorite: Favorite = {
              baseCurrency,
              targetCurrency,
              addedAt: new Date()
            };
            return from(addDoc(userFavoritesCollection,newFavorite)).pipe(
              switchMap(() => {
                this.alertService.showAlert('Ajouté aux favoris avec succès !', 'success');
                return of(true);
              })
            );
          })
        );
      })
    );
  }

  getUserFavorites(): Observable<Favorite[]> {
    return this.getUserUID().pipe(
      switchMap(uid => {
        if (!uid) return of([]);

        const userFavoritesCollection = collection(this.firestore, `users/${uid}/favorites`);
        return collectionData(userFavoritesCollection, { idField: 'id' }) as Observable<Favorite[]>;
      })
    );
  }

  /*getUserTravale(): Observable<any[]> {
    return this.getUserUID().pipe(
      switchMap(uid => {
        if (!uid) return of([]); // Si l'utilisateur n'est pas connecté, on retourne une liste vide

        const userTravelsCollection = collection(this.firestore, `users/${uid}/travel`);
        return collectionData(userTravelsCollection, { idField: 'id' }); // Retourne les données Firestore avec l'ID
      })
    );
  }*/

  deleteFavorite(favoriteId: string) {
    return this.getUserUID().pipe(
      switchMap(uid => {
        if (!uid) {
          return throwError(() => new Error('User not authenticated'));
        }
        const favoriteDoc = doc(this.firestore, `users/${uid}/favorites/${favoriteId}`);
        return from(deleteDoc(favoriteDoc)).pipe(
          map(() => {
            this.alertService.showAlert('Favori supprimé avec succès', 'success');
            return true;
          })
        );
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

  saveTravel(travelData: Travel) {
    return this.getUserUID().pipe(
      switchMap(uid => {
        if (!uid) {
          return throwError(() => new Error('User not authenticated'));
        }
        const travelCollection = collection(this.firestore, `users/${uid}/travels`);
        return from(addDoc(travelCollection, {
          ...travelData,
          createdAt: new Date()
        })).pipe(
          map(() => {
            this.alertService.showAlert('Votre voyage a été sauvegardé avec succès', 'success');
            return true;
          })
        );
      })
    );
  }

  updateTravel(travelId: string, travelData: any): Observable<boolean> {
    return this.getUserUID().pipe(
      switchMap(uid => {
        if (!uid) {
          return throwError(() => new Error('User not authenticated'));
        }
        const travelDoc = doc(this.firestore, `users/${uid}/travels/${travelId}`);
        return from(updateDoc(travelDoc, travelData)).pipe(
          map(() => {
            this.alertService.showAlert('Voyage mis à jour avec succès', 'success');
            return true;
          })
        );
      })
    );
  }

  getUserTravels(): Observable<Travel[]> {
    return this.getUserUID().pipe(
      switchMap(uid => {
        if (!uid) return of([]);
        const travelCollection = collection(this.firestore, `users/${uid}/travels`);
        return collectionData(travelCollection, { idField: 'id' }) as Observable<Travel[]>;
      })
    );
  }
}
