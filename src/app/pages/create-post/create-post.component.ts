import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'create-post',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {
  blogForm: FormGroup;
  selectedFile: File | null = null;  // Store the selected file

  constructor(private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      shortDescription: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', [this.urlValidator()]],
      description: ['', [Validators.required, Validators.minLength(20)]],
    });
  }

  urlValidator() {
    return (control: any) => {
      const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/;
      if (control.value && !urlRegex.test(control.value)) {
        return { invalidUrl: true };
      }
      return null;
    };
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.blogForm.get('imageUrl')?.setValue(''); // Clear the image URL if a file is selected
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit() {
    if (this.blogForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.blogForm.get('title')?.value);
    formData.append('shortDescription', this.blogForm.get('shortDescription')?.value);
    formData.append('description', this.blogForm.get('description')?.value);

    if (this.selectedFile) {
      formData.append('imageUpload', this.selectedFile);  // Add the file if it was uploaded
    }
    if (this.blogForm.get('imageUrl')?.value) {
      formData.append('imageUrl', this.blogForm.get('imageUrl')?.value);  // Add the URL if provided
    }

    // Log each entry in the FormData
    console.log('Form Data Submitted:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    // Process form submission with the FormData object
    // Send the formData to your backend or process it further
  }
}
