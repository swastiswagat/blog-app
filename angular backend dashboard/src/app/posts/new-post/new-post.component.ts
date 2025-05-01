import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css'],
})
export class NewPostComponent implements OnInit {
  permalink: string = '';
  imgSrc: string = './assets/images.png';
  selectedImg: any;
  categories: Array<any>;
  post: any;

  formStatus: string = 'Add New';
  docId: string;

  postForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    permalink: new FormControl(''),
    excerpt: new FormControl(''),
    category: new FormControl(''),
    postImg: new FormControl(''),
    content: new FormControl(''),
  });
  toastr: any;

  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((val) => {
      // console.log(val);
      this.docId = val['id'];
      if (this.docId) {
        this.postService.loadOneData(val['id']).subscribe((post) => {
          console.log(post);
          this.post = post;
          this.postForm = this.fb.group({
            title: [
              this.post.title,
              [Validators.required, Validators.minLength(10)],
            ],
            permalink: [this.post.permalink, Validators.requiredTrue],
            excerpt: [
              this.post.excerpt,
              [Validators.required, Validators.minLength(50)],
            ],
            category: [
              `${this.post.category.categoryId}-${this.post.category.category}`,
              Validators.required,
            ],
            postImg: ['', Validators.required],
            content: [this.post.content, Validators.required],
          });
          this.imgSrc = this.post.postImgPath;
          this.formStatus = 'Edit';
        });
      } else {
        this.postForm = this.fb.group({
          title: ['', [Validators.required, Validators.minLength(10)]],
          permalink: ['', Validators.requiredTrue],
          excerpt: ['', [Validators.required, Validators.minLength(50)]],
          category: ['', Validators.required],
          postImg: ['', Validators.required],
          content: ['', Validators.required],
        });
      }
    });
  }

  ngOnInit(): void {
    this.categoryService.loadData().subscribe((val) => {
      this.categories = val;
    });
  }

  get fc() {
    return this.postForm.controls;
  }
  onTitleChanged($event: any) {
    const title = $event.target.value;
    this.permalink = title.replace(/\s/g, '-');
    // let permalink = title.replaceAll(' ', '-');
    // console.log(this.permalink);
  }
  showPreview($event: any) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imgSrc = reader.result as string;
    };
    reader.readAsDataURL($event.target.files[0]);
    this.selectedImg = $event.target.files[0];
  }

  onSubmit() {
    // console.log(this.postForm.value);
    console.log('🚀 Submitting form...');
  console.log('Form value:', this.postForm.value);
  console.log('Selected image:', this.selectedImg);
  if (!this.selectedImg) {
    console.error('❌ No image selected!');
    this.toastr.error('Please select an image');
    return;
  }

    let splitted = this.postForm.value.category.split('-');

    // console.log(splitted);

    const postData: Post = {
      title: this.postForm.value.title,
      permalink: this.postForm.value.permalink,
      category: {
        categoryId: splitted[0],
        category: splitted[1],
      },
      postImgPath: '',
      excerpt: this.postForm.value.excerpt,
      content: this.postForm.value.content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    };
    console.log(postData);

    this.postService.uploadImage(
      this.selectedImg,
      postData,
      this.formStatus,
      this.docId
    );
    this.postForm.reset();
    this.imgSrc = './assets/images.png';
  }
}
