import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Post } from '../../../Models/post.model';
import { PostsService } from '../../../services/posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  public postFormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
  });
  public showError: boolean = false;

  constructor(
    private _snackBar: MatSnackBar,
    private postService: PostsService
  ) {}

  ngOnInit(): void {}

  onAddPost() {
    if (!this.postFormGroup.valid) {
      this.openSnackBar('Please Enter Valid Data!', 'OK');
      this.showError = true;
      return;
    }
    const post: Post = {
      title: this.postFormGroup.value.title,
      content: this.postFormGroup.value.content,
    };

    this.postService.addPost(post);
    this.showError = false;
    this.postFormGroup.reset('');
  }

  getFormControl(controlName: string) {
    return this.postFormGroup.get(controlName);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
