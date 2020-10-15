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
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { transformedPostsResponse } from '../Models/transformedPostsResponse.model';

interface PostsResponse {
  message?: string;
  posts: Array<any>;
  totalPostCount: number;
}

interface PostResponse {
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
      .get<PostsResponse>(environment.API_URL + '/posts' + queryParams)
      .pipe(
        map((res) => {
          return {
            posts: res.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            totalPostCount: res.totalPostCount,
          };
        })
      )
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        const updatedTransformedPostData: transformedPostsResponse = {
          posts: this.posts,
          totalPostCount: transformedPostData.totalPostCount,
        };
        this.postsUpdated.next(updatedTransformedPostData);
      });
  }

  getPost(postId: string) {
    return this.httpClient.get<PostResponse>(
      environment.API_URL + '/posts/' + postId
    );
  }

  addPost(post: Post) {
    const postFormData = new FormData();
    postFormData.append('title', post.title);
    postFormData.append('content', post.content);
    postFormData.append('image', post.image, post.title);
    this.httpClient
      .post<PostResponse>(environment.API_URL + '/posts', postFormData)
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
      creator: null,
    };
    if (typeof post.image === 'object') {
      const postFormData = new FormData();
      postFormData.append('title', post.title);
      postFormData.append('content', post.content);
      postFormData.append('image', post.image, post.title);
      postFormData.append('creator', null);
      postData = postFormData;
    } else {
      postData = updatedPostWithoutNewImage;
    }
    this.httpClient
      .put(environment.API_URL + '/posts/' + post.id, postData)
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
    return this.httpClient.delete(environment.API_URL + '/posts/' + postId);
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
