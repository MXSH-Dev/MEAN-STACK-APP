import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Post } from '../Models/post.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

interface postsResponse {
  message: string;
  posts: Array<any>;
}

interface postResponse {
  message: string;
  post: Post;
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private httpClient: HttpClient,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts() {
    this.httpClient
      .get<postsResponse>('http://localhost:3000/api/posts')
      .pipe(
        map((res) => {
          return res.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(postId: string) {
    return this.httpClient.get<postResponse>(
      'http://localhost:3000/api/posts/' + postId
    );
  }

  addPost(post: Post) {
    this.httpClient
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((response) => {
        const id = response.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.openSnackBar('Add Post Success!', 'OK', 'center', 'bottom');
        this._router.navigate(['/']);
      });
  }

  updatePost(post: Post) {
    this.httpClient
      .put('http://localhost:3000/api/posts/' + post.id, post)
      .subscribe((response) => {
        console.log(response);
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.openSnackBar('Update Post Success!', 'OK', 'center', 'bottom');
        this._router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.httpClient
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        // console.log('deleted');
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...updatedPosts]);
      });
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
