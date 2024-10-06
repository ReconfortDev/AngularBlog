import { Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {PostComponent} from "./pages/post/post.component";
import {AuthComponent} from "./pages/auth/auth.component";
import {RegisterComponent} from "./pages/register/register.component";
import {CreatePostComponent} from "./pages/create-post/create-post.component";
import {EditPostComponent} from "./pages/edit-post/edit-post.component";
import {ProfileComponent} from "./pages/profile/profile.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'article/:id', component: PostComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create', component: CreatePostComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'edit-post/:id', component: EditPostComponent },
  { path: '**', redirectTo: '/home' }
];
