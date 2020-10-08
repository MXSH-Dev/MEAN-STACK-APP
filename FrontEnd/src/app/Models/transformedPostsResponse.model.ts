import { Post } from './post.model';

export interface transformedPostsResponse {
  posts: Post[];
  totalPostCount: number;
}
