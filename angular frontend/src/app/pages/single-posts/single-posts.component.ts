import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-single-posts',
  templateUrl: './single-posts.component.html',
  styleUrls: ['./single-posts.component.css'],
})
export class SinglePostsComponent implements OnInit {
  postData: any;
  similarPostArray: Array<any>;
  constructor(
    private route: ActivatedRoute,
    private postService: PostsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((val) => {
      this.postService.countViews(val['id']);
      this.postService.loadOnePost(val['id']).subscribe((post) => {
        console.log(post);
        this.postData = post;
        this.loadSimilarPost(this.postData.category.categoryId);
      });
    });
  }

  loadSimilarPost(catId) {
    this.postService.loadSimilar(catId).subscribe((val) => {
      this.similarPostArray = val;
    });
  }
}
