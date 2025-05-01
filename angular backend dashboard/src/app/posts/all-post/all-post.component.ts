import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css'],
})
export class AllPostComponent implements OnInit {
  postArray: Array<any>;
  constructor(private postService: PostsService) {}

  ngOnInit(): void {
    this.postService.loadData().subscribe((val) => {
      console.log(val);
      this.postArray = val;
    });
  }
  onDelete(postImgPath, id) {
    this.postService.deleteImage(postImgPath, id);
  }
  onFeatured(id, value) {
    const featuredData = {
      isFeatured: value,
    };
    this.postService.markFeatured(id, featuredData);
  }
}
