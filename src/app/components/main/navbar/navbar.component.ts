import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../services/auth.service";
import {User, user} from "@angular/fire/auth";
import {UserInterface} from "../../../models/user.interface";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);

  ngOnInit() {
    this.authService.user$.subscribe((user: User | null) => {
        if (user) {
          this.authService.currentUserSig.set({
            email: user.email!,
            username: user.displayName!
          });
        } else {
          this.authService.currentUserSig.set(null)
        }
        console.log(this.authService.currentUserSig())
      }
    )
  }

  logout(): void{
    this.authService.logout()
  }

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({behavior: 'smooth'});
  }
}
