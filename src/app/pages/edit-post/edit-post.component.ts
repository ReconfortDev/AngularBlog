import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from "@angular/fire/firestore";
import { AuthService } from '../../services/auth/auth.service';
import { Post } from '../../models/post';
import {UserInterface} from "../../models/user.interface";
import {User} from "@angular/fire/auth";
import {NgIf} from "@angular/common";
import {SubscribeComponent} from "../../components/main/subscribe/subscribe/subscribe.component";

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    SubscribeComponent
  ],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent {
  blogForm: FormGroup;
  postId!: string;
  postData!: Post;
  currentUserId!: string | null;
  errorMessage!: string | null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private authService: AuthService
  ) {
    this.blogForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  ngOnInit(): void {
    // Get the current user
    this.authService.user$.subscribe((user: User | null) => {
      if (user) {
        this.authService.currentUserSig.set({
          uid: user.uid!,
          email: user.email!,
          username: user.displayName!,
        });
        this.currentUserId = user.uid!;
      } else {
        this.authService.currentUserSig.set(null);
        this.currentUserId = ''; // If nou ser Reset
      }
    });

    // Get the post ID from the route
    this.postId = this.route.snapshot.paramMap.get('id') || '';

    // Fetch post data from Firestore
    this.fetchPostData();
  }

  // Fetch post data based on postId
  fetchPostData(): void {
    const postDocRef = doc(this.firestore, 'posts', this.postId);
    getDoc(postDocRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        this.postData = docSnapshot.data() as Post;

        // Populate the form with post data
        this.blogForm.patchValue({
          title: this.postData.title,
          shortDescription: this.postData.shortDescription,
          imageUrl: this.postData.imageUrl,
          description: this.postData.description
        });
      } else {
        this.errorMessage = 'Post not found';
      }
    }).catch((error) => {
      this.errorMessage = 'Error fetching post data: ' + error.message;
    });
  }

  // Handle form submission to update post
  onSubmit(): void {
    if (this.blogForm.invalid) {
      return;
    }

    const updatedPostData = {
      title: this.blogForm.value.title,
      shortDescription: this.blogForm.value.shortDescription,
      imageUrl: this.blogForm.value.imageUrl,
      description: this.blogForm.value.description,
      dateUpdated: Date.now()  // Add a timestamp for when the post was updated
    };

    // Update the post in Firestore
    const postDocRef = doc(this.firestore, 'posts', this.postId);
    updateDoc(postDocRef, updatedPostData).then(() => {
      this.router.navigateByUrl('/home');  // Navigate to the home page after the update
    }).catch((error) => {
      this.errorMessage = 'Error updating post: ' + error.message;
    });
  }
}
