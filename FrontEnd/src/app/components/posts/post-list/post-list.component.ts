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
  isLoading: boolean = false;

  private postSub: Subscription;

  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts();
    this.postSub = this.postService
      .getPostUpdateListener()
      .subscribe((updatedPosts) => {
        this.posts = updatedPosts;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  onDelete(postID: string) {
    // console.log(postID);
    this.postService.deletePost(postID);
  }
}
