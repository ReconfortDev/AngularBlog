import {Component} from '@angular/core';
import {CardComponent} from "../../card/card.component";
import {Observable} from "rxjs";
import {collection, collectionData, Firestore} from "@angular/fire/firestore";
import {CommonModule} from "@angular/common";
import {Post} from "../../../models/post";

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [
    CardComponent, CommonModule
  ],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css'
})
export class NewsletterComponent {

  posts$!: Observable<Post[]>;

  constructor(private readonly firestore: Firestore) {
    const postsCollection = collection(this.firestore, 'posts');
    this.posts$ = collectionData(postsCollection, { idField: 'id' }) as Observable<Post[]>;
  }
}
