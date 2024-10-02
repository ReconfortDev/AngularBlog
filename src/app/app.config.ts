import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getAuth, provideAuth} from "@angular/fire/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOsWdGICUIQNZa6iNNKpQNm7v4BBuup3A",
  authDomain: "amali-blog.firebaseapp.com",
  projectId: "amali-blog",
  storageBucket: "amali-blog.appspot.com",
  messagingSenderId: "495826624689",
  appId: "1:495826624689:web:23b86dc694fdac8bb58290"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth())
  ]
};
