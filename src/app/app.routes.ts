import { Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {PostComponent} from "./pages/post/post.component";
import {AuthComponent} from "./pages/auth/auth.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'post', component: PostComponent },
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: '/home' }
];
