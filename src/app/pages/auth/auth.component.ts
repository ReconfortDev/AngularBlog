import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {NewsletterComponent} from "../../components/main/newsletter/newsletter.component";
import {CardComponent} from "../../components/card/card.component";


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    NewsletterComponent,
    CardComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
loginForm: FormGroup;

constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })
}

onSubmit() {
  if (this.loginForm.valid) {
    const rawForm = this.loginForm.value
    this.authService
      .login(rawForm.email, rawForm.password)
      .subscribe(() => {
        this.router.navigateByUrl('/home')
      })
  }
  else {
    console.log('Login failed.');
  }
}


  loginWithGoogle() {
    this.authService.googleSignin().subscribe({
      next: () => {
        this.router.navigateByUrl('/home')
        console.log('Google sign-in successful');
      },
      error: (err) => {
        console.error('Google sign-in error', err);
      }
    });
  }


}
