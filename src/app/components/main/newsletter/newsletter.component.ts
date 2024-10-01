import { Component } from '@angular/core';
import {CardComponent} from "../../card/card.component";

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [
    CardComponent
  ],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {

}
