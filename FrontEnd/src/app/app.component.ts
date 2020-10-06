import { Component } from '@angular/core';
import { Post } from './Models/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  posts: Array<Post> = [];

  onPostAdded(post) {
    console.log(post);

    this.posts.push(post);
  }
}
