import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/main/navbar/navbar.component';
import { NewsletterComponent } from './components/main/newsletter/newsletter.component';
import { HomeComponent } from './components/main/home/home.component';
import { Analytics } from '@angular/fire/analytics';
import { logEvent } from 'firebase/analytics';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NewsletterComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'FireBlog';

  constructor(private router: Router, private analytics: Analytics) {}

  ngAfterViewInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        logEvent(this.analytics, 'page_view', {
          page_path: event.urlAfterRedirects,
        });
      });
  }
}
