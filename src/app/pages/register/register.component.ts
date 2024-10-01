import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {Router, RouterLink} from "@angular/router";



@Component({
  selector: 'register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const rawForm = this.registerForm.value
      this.authService
        .register(rawForm.email, rawForm.username, rawForm.password)
        .subscribe(() => {
        this.router.navigateByUrl('/home')
      })
    } else {
      console.log('Form is invalid');
    }
  }

}
