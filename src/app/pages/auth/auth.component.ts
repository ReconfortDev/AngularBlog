import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth/auth.service";
import {Router, RouterLink} from "@angular/router";
import {NewsletterComponent} from "../../components/main/newsletter/newsletter.component";
import {CardComponent} from "../../components/card/card.component";
import {AuthFormComponent} from "../../components/main/auth-form/auth-form.component";


@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NewsletterComponent,
    CardComponent,
    AuthFormComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
loginForm: FormGroup;

constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
  this.loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })
}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(() => {
        this.router.navigateByUrl('/home');
      });
    }
  }


}
