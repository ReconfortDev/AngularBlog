import { Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {PostComponent} from "./pages/post/post.component";
import {AuthComponent} from "./pages/auth/auth.component";
import {RegisterComponent} from "./pages/register/register.component";
import {CreatePostComponent} from "./pages/create-post/create-post.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'post', component: PostComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create', component: CreatePostComponent },
  { path: '**', redirectTo: '/home' }
];
