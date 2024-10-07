import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          observer.next(true); // User is logged in, allow access
        } else {
          this.router.navigate(['/home']); // User is not logged in, redirect to home
          observer.next(false); // Deny access
        }
        observer.complete();
      });
    });
  }
}
