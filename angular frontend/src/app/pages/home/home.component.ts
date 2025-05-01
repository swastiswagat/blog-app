import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  featuredPostsArray: Array<any>;
  latestPostsArray: Array<any>;

  constructor(private postService: PostsService) {
    this.postService.loadFeatured().subscribe((val) => {
      // console.log(val);
      this.featuredPostsArray = val;
    });

    this.postService.loadLatest().subscribe((val) => {
      this.latestPostsArray = val;
    });
  }

  ngOnInit(): void {}
}
