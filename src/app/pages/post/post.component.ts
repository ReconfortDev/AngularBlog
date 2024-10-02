import {Component, OnInit} from '@angular/core';
import {doc, Firestore, getDoc, updateDoc} from "@angular/fire/firestore";
import {ActivatedRoute} from "@angular/router";
import {Post} from "../../models/post";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for Angular directives
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  post!: Post;
  postId!: string;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id') as string; // Get post ID from URL
    if (this.postId) {
      this.loadPost(this.postId);
    }
  }

  async loadPost(postId: string) {
    const postRef = doc(this.firestore, `posts/${postId}`);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      this.post = postDoc.data() as Post; // Load the post data
    } else {
      console.error("Post not found");
    }
  }

  getFormattedAuthorId(): string {
    const minLength = 8;
    const paddingChar = '*';

    if (this.post.authorId) {
      const truncatedId = this.post.authorId.slice(0, 6);
      return truncatedId.length < minLength
        ? truncatedId.padEnd(minLength, paddingChar)
        : truncatedId;
    }

    return 'Unknown Author';
  }

  likePost(currentLikes: number) {
    const postDocRef = doc(this.firestore, 'posts', this.postId);

    updateDoc(postDocRef, {
      likes: currentLikes + 1
    }).then(() => {
      console.log('Likes updated successfully');
      this.post.likes = currentLikes + 1; // Update locally for instant feedback
    }).catch((error) => {
      console.error('Error updating likes: ', error);
    });
  }
}
