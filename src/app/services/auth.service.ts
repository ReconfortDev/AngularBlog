import {inject, Injectable, signal} from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider, onAuthStateChanged,
  signInWithEmailAndPassword, signInWithPopup, signOut,
  updateProfile, User,
  user
} from "@angular/fire/auth";
import {from, map, Observable} from "rxjs";
import {UserInterface} from "../models/user.interface";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseAuth = inject(Auth)
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);
  currentUserId! :string | null

  register(email: string, username: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(
      response => updateProfile(
        response.user, {displayName: username}
      )
    )

    return from(promise)
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {})

    return from(promise)
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth);
    return from(promise)
  }

  googleSignin(): Observable<void> {
      const googleProvider = new GoogleAuthProvider();
      const promise = signInWithPopup(this.firebaseAuth, googleProvider).then(() => {})
      return from(promise);
  }

  getCurrentUserId(): Observable<string | null> {
    return this.user$.pipe(
      map((user: UserInterface | null) => {
        if (user) {
          this.currentUserId = user.uid!;
          return this.currentUserId;
        }
        this.currentUserId = null; // Reset if no user
        return null;
      })
    );
  }
}
