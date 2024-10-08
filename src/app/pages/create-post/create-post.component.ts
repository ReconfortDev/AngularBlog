import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from "@angular/common";
import {Firestore} from "@angular/fire/firestore";
import {addDoc, collection} from "@angular/fire/firestore";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {User} from "@angular/fire/auth";
import {SubscribeComponent} from "../../components/main/subscribe/subscribe/subscribe.component";

@Component({
  selector: 'create-post',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    SubscribeComponent
  ],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  blogForm: FormGroup;
  firestore: Firestore = inject(Firestore);
  errorMessage!: string | null
  currentUserId!: string | undefined
  currentUserName!: string | null


  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.blogForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  ngOnInit() {
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

  saveData() {
    const collectionHelper = collection(this.firestore, 'posts')
    addDoc(collectionHelper, {
      'title': this.blogForm.value.title,
      'shortDescription': this.blogForm.value.shortDescription,
      'imageUrl': this.blogForm.value.imageUrl,
      'description': this.blogForm.value.description,
      'authorId': this.currentUserId,
      'authorName': this.currentUserName,
      'likes': 0,
      'share': 0,
      'datePosted': Date.now()
    }).then(() => {
      this.router.navigateByUrl('/home')
      this.blogForm.reset();
    }).catch((err) => {
      this.errorMessage = err
    })
  }

  onSubmit() {
    if (this.blogForm.invalid) {
      return;
    }
    this.saveData()
  }
}
