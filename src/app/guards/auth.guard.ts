import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: Auth, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return new Observable(observer => {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          observer.next(true);  // Utilisateur connecté -> accès autorisé
        } else {
          this.router.navigate(['/login']);  // Redirection vers la page de login
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}
