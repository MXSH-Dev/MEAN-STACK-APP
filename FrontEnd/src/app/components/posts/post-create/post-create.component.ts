import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

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
  public mode: string = 'create';
  private postId: string = null;
  public isLoading: boolean = false;

  constructor(
    private _snackBar: MatSnackBar,
    private postService: PostsService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((response) => {
          console.log(response.message);

          this.postFormGroup.patchValue({
            title: response.post.title,
            content: response.post.content,
          });

          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (!this.postFormGroup.valid) {
      this.openSnackBar('Please Enter Valid Data!', 'OK', 'center', 'top');
      this.showError = true;
      return;
    }
    this.isLoading = true;
    const post: Post = {
      id: this.postId,
      title: this.postFormGroup.value.title,
      content: this.postFormGroup.value.content,
    };

    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else if (this.mode === 'edit') {
      this.postService.updatePost(post);
    }
    this.showError = false;
  }

  getFormControl(controlName: string) {
    return this.postFormGroup.get(controlName);
  }

  openSnackBar(
    message: string,
    action: string,
    horizontalPos: MatSnackBarHorizontalPosition,
    verticalPos: MatSnackBarVerticalPosition
  ) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: horizontalPos,
      verticalPosition: verticalPos,
    });
  }
}
