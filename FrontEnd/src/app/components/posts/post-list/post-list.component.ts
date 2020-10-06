import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Post } from '../../../Models/post.model';
import { PostsService } from '../../../services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Array<Post> = [];

  private postSub: Subscription;

  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.posts = this.postService.getPosts();
    this.postSub = this.postService
      .getPostUpdateListener()
      .subscribe((updatedPosts) => {
        this.posts = updatedPosts;
      });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
