import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          this.router.navigate(['/home']); // User is logged in, redirect to home
          observer.next(false); // Block access to the login/register page
        } else {
          observer.next(true); // Allow access if not logged in
        }
        observer.complete();
      });
    });
  }
}
