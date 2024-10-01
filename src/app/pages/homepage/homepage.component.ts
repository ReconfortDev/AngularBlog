import { Component } from '@angular/core';
import {HomeComponent} from "../../components/main/home/home.component";
import {NewsletterComponent} from "../../components/main/newsletter/newsletter.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
    imports: [
        HomeComponent,
        NewsletterComponent
    ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
