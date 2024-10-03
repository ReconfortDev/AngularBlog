import {Component, inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {addDoc, collection, collectionData, Firestore} from "@angular/fire/firestore";
import {map, Observable} from "rxjs";
import {Comments} from "../../../models/post";
import {AuthService} from "../../../services/auth.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit{
  commentForm!: FormGroup;
  comments$!: Observable<Comments[]>;
  firestore: Firestore = inject(Firestore);

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
  }

  postComment(){
    const collectionHelper = collection(this.firestore, 'comments')
    addDoc(collectionHelper,  {
      'userId': this.currentUserId,
      'postId': this.postId,
      content: {
        comment: this.commentForm.value.comment, // Access comment directly
      },
      'like':0,
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
