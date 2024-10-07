import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {addDoc, collection, collectionData, Firestore} from "@angular/fire/firestore";
import {map, Observable} from "rxjs";
import {Comments} from "../../../models/post";
import {AuthService} from "../../../services/auth/auth.service";
import {RouterLink} from "@angular/router";
import {User} from "@angular/fire/auth";
import {TimeAgoPipe} from "../../../helpers/time-ago.pipe";

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    TimeAgoPipe
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit{
  commentForm!: FormGroup;
  comments$!: Observable<Comments[]>;
  firestore: Firestore = inject(Firestore);
  currentUserName!: string | null

  authService = inject(AuthService)

  @Input() currentUserId!: string | null;
  @Input() postId!: string;

  errorMessage!: string | null

  constructor(private formBuilder: FormBuilder) {
    const commentCollection = collection(this.firestore, 'comments');
    // this.comments$ = collectionData(commentCollection, { idField: 'id' }) as Observable<Comments[]>;
    this.comments$ = collectionData(commentCollection, { idField: 'id' }).pipe(
        map((comments :Comments[]) => comments.filter(comment => comment.postId === this.postId))
    );
  }



  ngOnInit() {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required, Validators.minLength(5)]],
    });

    this.authService.user$.subscribe((user: User | null) => {
      if (user) {
        this.authService.currentUserSig.set({
          uid: user.uid!,
          email: user.email!,
          username: user.displayName!,
        });
        this.currentUserId = user.uid!;
        this.currentUserName = user.displayName!;
      } else {
        this.authService.currentUserSig.set(null);
        this.currentUserId = ''; // If nou ser Reset
      }
    });
  }

  postComment(){
    const collectionHelper = collection(this.firestore, 'comments')
    addDoc(collectionHelper,  {
      'userId': this.currentUserId,
      'username': this.currentUserName,
      'postId': this.postId,
      content: {
        comment: this.commentForm.value.comment, // Access comment directly
      },
      'createdDate': Date.now()
    }).then(() => {
      console.log("Congratulations")
      this.commentForm.reset();
    }).catch((err) => {
      this.errorMessage = err
    })
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      this.postComment()
    } else {
      this.commentForm.markAllAsTouched();
    }
  }


}
