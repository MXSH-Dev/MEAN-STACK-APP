import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';
import { Page } from '../../../Models/page.model';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorConfiguration } from '../../../Models/paginator.model';
import { Post } from '../../../Models/post.model';
import { PostsService } from '../../../services/posts.service';
import { Subscription } from 'rxjs';
import { transformedPostsResponse } from '../../../Models/transformedPostsResponse.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Array<Post> = [];
  isLoading: boolean = false;

  paginatorConfig: PaginatorConfiguration = {
    length: 0,
    pageSize: 2,
    pageSizeOptions: [2, 5],
  };

  page: Page = {
    length: this.paginatorConfig.length,
    pageIndex: 0,
    pageSize: this.paginatorConfig.pageSize,
    previousPageIndex: 0,
  };

  private postSub: Subscription;
  private authListenerSubscription: Subscription;
  public userIsAuthenticated: boolean = false;

  constructor(
    private postService: PostsService,
    private _autService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.userIsAuthenticated = this._autService.getIsAuth();

    this.authListenerSubscription = this._autService
      .getAuthStatusListener()
      .subscribe((value) => {
        // console.log(value);
        this.userIsAuthenticated = value;
      });

    this.postService.getPosts(this.page);
    this.postSub = this.postService
      .getPostUpdateListener()
      .subscribe((updatedPosts: transformedPostsResponse) => {
        this.posts = updatedPosts.posts;
        this.paginatorConfig.length = updatedPosts.totalPostCount;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authListenerSubscription.unsubscribe();
  }

  onDelete(postID: string) {
    // console.log(postID);
    this.isLoading = true;
    this.postService.deletePost(postID).subscribe(() => {
      this.postService.getPosts(this.page);
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.page = {
      length: pageData.length,
      pageIndex: pageData.pageIndex,
      pageSize: pageData.pageSize,
      previousPageIndex: pageData.previousPageIndex,
    };
    console.log(this.page);
    this.postService.getPosts(this.page);
  }
}
