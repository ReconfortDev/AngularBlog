import {Component, OnInit} from '@angular/core';
import {doc, Firestore, getDoc, updateDoc} from "@angular/fire/firestore";
import {ActivatedRoute} from "@angular/router";
import {Post} from "../../models/post";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  post!: Post;
  postId!: string;
  currentUserId!: string | null;
  isShareDisabled: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getCurrentUserId().subscribe((userId) => {
      this.currentUserId = userId;

      // Now it's safe to work with postId and currentUserId
      this.postId = this.route.snapshot.paramMap.get('id') as string; // Get post ID from URL

      if (this.postId) {
        this.loadPost(this.postId);
      }
    });
  }

  async loadPost(postId: string) {
    const postRef = doc(this.firestore, `posts/${postId}`);
    const postDoc = await getDoc(postRef);
    if (postDoc.exists()) {
      this.post = postDoc.data() as Post; // Load the post data
      console.log("This.Post", this.post)
      console.log("Current User ID:", this.currentUserId);
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

  async toggleLike() {
    if (!this.currentUserId) return; // Ensure the user is logged in

    const postDocRef = doc(this.firestore, 'posts', this.postId);
    const postDoc = await getDoc(postDocRef);


    if (postDoc.exists()) {
      const postData = postDoc.data() as Post;

      let likes = postData.likes || 0;
      let likedBy = postData.likedBy || []; // Array of user IDs who liked the post
      this.post.liked = !this.post.liked;

      // Check if the current user has already liked the post
      const hasLiked = likedBy.includes(this.currentUserId);

      if (hasLiked) {
        // User has already liked the post, so we remove their like
        likedBy = likedBy.filter((userId: string) => userId !== this.currentUserId);
        likes--;
      } else {
        // User has not liked the post, so we add their like
        likedBy.push(this.currentUserId);
        likes++;
      }

      // Update Firestore
      updateDoc(postDocRef, {
        likes: likes,
        likedBy: likedBy
      }).then(() => {
        console.log(hasLiked ? 'Like removed' : 'Post liked');
        this.post.likes = likes; // Update locally for instant feedback
        this.post.likedBy = likedBy; // Update the likedBy list locally
      }).catch((error) => {
        console.error('Error updating likes: ', error);
      });
    }
  }

  getPostUrl(): string {
    return `http://localhost:4200/article/${this.postId}`; // Replace with your actual URL format
  }


  sharingPost(currentShareNumber: number) {
    if (this.isShareDisabled) {
      console.log('Share button is temporarily disabled.');
      return; // Exit if the button is disabled
    }

    const postDocRef = doc(this.firestore, 'posts', this.postId);

    // Disable the share button
    this.isShareDisabled = true;

    // Update the share count in Firestore
    updateDoc(postDocRef, {
      share: currentShareNumber + 1
    }).then(() => {
      console.log('Shares updated successfully');

      // Update local share count for instant feedback
      this.post.share = currentShareNumber + 1;

      // Copy the post URL to clipboard
      const postUrl = this.getPostUrl();
      navigator.clipboard.writeText(postUrl).then(() => {
        console.log('Post URL copied to clipboard:', postUrl);

        // Re-enable the share button after 2 minutes
        setTimeout(() => {
          this.isShareDisabled = false; // Re-enable the button after 2 minutes
        }, 120000); // 120000 milliseconds = 2 minutes
      }).catch((err) => {
        console.error('Could not copy text: ', err);
      });
    }).catch((error) => {
      console.error('Error updating shares: ', error);
    });
  }
}
