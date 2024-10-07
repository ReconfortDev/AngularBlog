import {Component, inject, Input} from '@angular/core';
import {RouterLink} from "@angular/router";
import {collection, collectionData, doc, Firestore, updateDoc} from '@angular/fire/firestore';
import {Comments, Post} from "../../models/post";
import {map, Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {TimeAgoPipe} from "../../helpers/time-ago.pipe";

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    RouterLink,
    AsyncPipe,
    TimeAgoPipe
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() post!: Post;
  comments$!: Observable<Comments[]>

  firestore: Firestore = inject(Firestore);

  constructor() {
    const commentCollection = collection(this.firestore, 'comments');
    this.comments$ = collectionData(commentCollection, { idField: 'id' }).pipe(
      map((comments :Comments[]) => comments.filter(comment => comment.postId === this.post.id))
    );
  }
}
