import { Component, OnInit } from '@angular/core';
import { doc, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../../models/post';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { CommentsComponent } from '../../components/main/comments/comments.component';
import { TimeAgoPipe } from '../../helpers/time-ago.pipe';
import { User } from '@angular/fire/auth';
import { PostService } from '../../services/post/post.service';
import {SubscribeComponent} from "../../components/main/subscribe/subscribe/subscribe.component";

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, CommentsComponent, TimeAgoPipe, SubscribeComponent],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  post!: Post;
  postId!: string;
  currentUserId!: string | null;
  isShareDisabled: boolean = false;
  showAdminAction = false;
  message!: string

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private authService: AuthService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUserId().subscribe((userId) => {
      this.currentUserId = userId;
      this.postId = this.route.snapshot.paramMap.get('id') as string;

      if (this.postId) {
        this.loadPost(this.postId); // Load post data when we have the postId
      }
    });

    this.authService.user$.subscribe((user: User | null) => {
      if (user) {
        this.authService.currentUserSig.set({
          uid: user.uid!,
          email: user.email!,
          username: user.displayName!,
        });

        // Check if the post is loaded and the current user is the author
        if (this.post && user.uid === this.post.authorId) {
          this.showAdminAction = true;
        }
      }
    });
  }

  async loadPost(postId: string) {
    try {
      const postRef = doc(this.firestore, `posts/${postId}`);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        this.post = postDoc.data() as Post;

        // Check if the current user is the author after the post is loaded
        if (this.currentUserId && this.post.authorId === this.currentUserId) {
          this.showAdminAction = true;
        }
      } else {
        console.error('Post not found');
      }
    } catch (error) {
      console.error('Error loading post:', error);
    }
  }

  splitTitle(title: string): { part1: string; part2: string } {
    const words = title.split(' ');
    const midIndex = Math.ceil(words.length / 2);
    const part1 = words.slice(0, midIndex).join(' ');
    const part2 = words.slice(midIndex).join(' ');

    return { part1, part2 };
  }

  // Like toggle functionality
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
        likedBy = likedBy.filter(
          (userId: string) => userId !== this.currentUserId
        );
        likes--;
      } else {
        // User has not liked the post, so we add their like
        likedBy.push(this.currentUserId);
        likes++;
      }

      // Update Firestore
      updateDoc(postDocRef, {
        likes: likes,
        likedBy: likedBy,
      })
        .then(() => {
          this.post.likes = likes; // Update locally for instant feedback
          this.post.likedBy = likedBy; // Update the likedBy list locally
        })
        .catch((error) => {
          console.error('Error updating likes: ', error);
        });
    }
  }

  // Share post functionality
  getPostUrl(): string {
    return `https://amali-blog.web.app/article/${this.postId}`;
  }

  async deletePost() {
    if (this.currentUserId !== this.post.authorId) {
      this.message = "You are not authorized"
      return;
    }

    const confirmDelete = confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      await this.postService.deletePost(this.postId);
      this.router.navigateByUrl('home');
    }
  }

  editPost() {
    this.router.navigate(['/edit-post', this.postId]);
  }

  sharingPost(currentShareNumber: number) {
    if (this.isShareDisabled) {
      return; // Exit if the button is disabled
    }

    const postDocRef = doc(this.firestore, 'posts', this.postId);

    // Disable the share button
    this.isShareDisabled = true;

    // Update the share count in Firestore
    updateDoc(postDocRef, {
      share: currentShareNumber + 1,
    })
      .then(() => {
        // Update local share count for instant feedback
        this.post.share = currentShareNumber + 1;

        // Copy the post URL to clipboard
        const postUrl = this.getPostUrl();
        navigator.clipboard
          .writeText(postUrl)
          .then(() => {
            this.message = "Post URL copied to clipboard"; // Display success message

            // Re-enable the share button after 2 minutes
            setTimeout(() => {
              this.isShareDisabled = false; // Re-enable the button after 2 minutes
              this.message = ''; // Clear the message after 2 minutes
            }, 120000); // 120000 milliseconds = 2 minutes
          })
          .catch((err) => {
            console.error('Could not copy text: ', err);
            this.message = 'Error copying URL'; // Display error message
          });
      })
      .catch((error) => {
        console.error('Error updating shares: ', error);
        this.message = 'Error sharing post'; // Display error message
      });
  }

}
