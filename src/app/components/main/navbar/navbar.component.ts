import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {User,} from "@angular/fire/auth";
import {HamburgerComponent} from "./hamburger/hamburger.component";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    HamburgerComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthService);
  isHamburgerActive = false;

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
      }
    )
  }

  getFirstUsername(): string {
    const username = this.authService.currentUserSig()?.username;

    if (username) {
      return username.split(' ')[0];
    }

    return '';
  }

  toggleHamburger(){
    this.isHamburgerActive = !this.isHamburgerActive
  }


  logout(): void{
    this.authService.logout()
  }

  scrollTo(section: string) {
    document.getElementById(section)?.scrollIntoView({behavior: 'smooth'});
  }
}
