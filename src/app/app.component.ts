import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./components/main/navbar/navbar.component";
import {NewsletterComponent} from "./components/main/newsletter/newsletter.component";
import {HomeComponent} from "./components/main/home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NewsletterComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FireBlog';
}
