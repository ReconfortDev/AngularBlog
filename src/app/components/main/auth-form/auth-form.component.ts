import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {NgIf} from "@angular/common";
import {AuthService} from "../../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'auth-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.css'
})
export class AuthFormComponent {
  errorMessage! : string
  @Input() formGroup!: FormGroup;
  @Input() buttonText!: string;
  @Input() showUsernameField: boolean = false;

  @Output() submitForm = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    // If form is valid tell parent that form is submitted
    if (this.formGroup.valid) {
      this.submitForm.emit();
    }
  }

  loginWithGoogle() {
    this.authService.googleSignin().subscribe({
      next: () => {
        this.router.navigateByUrl('/home')
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });
  }

}
