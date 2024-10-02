import {Component, inject, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {doc, Firestore, updateDoc} from '@angular/fire/firestore';
import {Post} from "../../models/post";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() post!: Post;
  firestore: Firestore = inject(Firestore);
}
