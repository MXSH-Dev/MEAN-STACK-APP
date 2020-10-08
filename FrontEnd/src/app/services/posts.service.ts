import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from '../Models/page.model';
import { Post } from '../Models/post.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { transformedPostsResponse } from '../Models/transformedPostsResponse.model';

interface postsResponse {
  message?: string;
  posts: Array<any>;
  totalPostCount: number;
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
  private postsUpdated = new Subject<transformedPostsResponse>();

  constructor(
    private httpClient: HttpClient,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts(page: Page) {
    const queryParams = `?pageSize=${page.pageSize}&currentPage=${page.pageIndex}`;
    this.httpClient
      .get<postsResponse>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map((res) => {
          return {
            posts: res.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            totalPostCount: res.totalPostCount,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        const updatedTramsformedPostData: transformedPostsResponse = {
          posts: this.posts,
          totalPostCount: transformedPostData.totalPostCount,
        };
        this.postsUpdated.next(updatedTramsformedPostData);
      });
  }

  getPost(postId: string) {
    return this.httpClient.get<postResponse>(
      'http://localhost:3000/api/posts/' + postId
    );
  }

  addPost(post: Post) {
    const postFormData = new FormData();
    postFormData.append('title', post.title);
    postFormData.append('content', post.content);
    postFormData.append('image', post.image, post.title);
    this.httpClient
      .post<postResponse>('http://localhost:3000/api/posts', postFormData)
      .subscribe((response) => {
        // this.posts.push(response.post);
        // this.postsUpdated.next([...this.posts]);
        this.openSnackBar('Add Post Success!', 'OK', 'center', 'bottom');
        this._router.navigate(['/']);
      });
  }

  updatePost(post: Post) {
    let postData;
    const updatedPostWithoutNewImage = {
      id: post.id,
      title: post.title,
      content: post.content,
    };
    if (typeof post.image === 'object') {
      const postFormData = new FormData();
      postFormData.append('title', post.title);
      postFormData.append('content', post.content);
      postFormData.append('image', post.image, post.title);
      postData = postFormData;
    } else {
      postData = updatedPostWithoutNewImage;
    }
    this.httpClient
      .put('http://localhost:3000/api/posts/' + post.id, postData)
      .subscribe((response) => {
        // console.log(response);
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.openSnackBar('Update Post Success!', 'OK', 'center', 'bottom');
        this._router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.httpClient.delete('http://localhost:3000/api/posts/' + postId);
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
