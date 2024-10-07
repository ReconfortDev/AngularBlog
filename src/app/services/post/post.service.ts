import { Injectable } from '@angular/core';
import {deleteDoc, doc, Firestore} from "@angular/fire/firestore";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private currentPage = 1;
  private postsPerPage = 10;
  private postsSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  constructor(private firestore: Firestore) {}

  async deletePost(postId: string): Promise<void> {
    try {
      const postDocRef = doc(this.firestore, `posts/${postId}`);
      await deleteDoc(postDocRef);
    } catch (error) {
      console.error('Error deleting post: ', error);
    }
  }
}
