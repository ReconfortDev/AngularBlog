import { Routes } from '@angular/router';
import {HomepageComponent} from "./pages/homepage/homepage.component";
import {PostComponent} from "./pages/post/post.component";
import {AuthComponent} from "./pages/auth/auth.component";
import {RegisterComponent} from "./pages/register/register.component";
import {CreatePostComponent} from "./pages/create-post/create-post.component";
import {EditPostComponent} from "./pages/edit-post/edit-post.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {AuthGuard} from "./services/guards/auth/auth.guard";
import {NoAuthGuard} from "./services/guards/noAuth/no-auth.guard";
// import {AuthGuard} from "@angular/fire/auth-guard";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'article/:id', component: PostComponent },
  { path: 'auth', component: AuthComponent, canActivate: [NoAuthGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard]},
  { path: 'create', component: CreatePostComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  { path: 'edit-post/:id', component: EditPostComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/home' }
];
