import {Component, EventEmitter, inject, Output} from '@angular/core';
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../../services/auth/auth.service";

@Component({
  selector: 'app-hamburger',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './hamburger.component.html',
  styleUrl: './hamburger.component.css'
})
export class HamburgerComponent {
  @Output() logout = new EventEmitter<void>();
  authService = inject(AuthService);
  @Output() toggleBurger = new EventEmitter<void>();

  handleLogout(): void {
    this.logout.emit();
    this.toggleBurger.emit();
  }

}
