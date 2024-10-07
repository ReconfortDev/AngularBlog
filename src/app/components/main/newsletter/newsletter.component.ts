import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../card/card.component';
import {map, Observable} from 'rxjs';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { Post } from '../../../models/post';
import { AuthService } from '../../../services/auth/auth.service';
import {SubscribeComponent} from "../subscribe/subscribe/subscribe.component";

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CardComponent, CommonModule, SubscribeComponent],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.css',
})
export class NewsletterComponent implements OnInit{
  posts$!: Observable<Post[]>;

  constructor(private readonly firestore: Firestore) {}

  ngOnInit(): void {
    const postsCollection = collection(this.firestore, 'posts');
    this.posts$ = collectionData(postsCollection, {
      idField: 'id',
    }) as Observable<Post[]>;

    // Sort posts by new datePosted
    this.posts$ = this.posts$.pipe(
      map((posts: Post[]) =>
        posts.sort((a, b) => b.datePosted - a.datePosted)
      )
    );
  }
}
