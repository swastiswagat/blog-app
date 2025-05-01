import { Component, OnInit } from '@angular/core';
import { Category } from '../models/category';
import { CategoriesService } from './../services/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  categoryArray: Array<any>;
  formCategory: string;
  formStatus: string = 'Add';
  categoryId: string;
  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.categoriesService.loadData().subscribe((val) => {
      console.log(val);
      this.categoryArray = val;
    });
  }
  onSubmit(formData: any) {
    let categoryData: Category = {
      category: formData.value.category,
    };
    if (this.formStatus == 'Add') {
      this.categoriesService.saveData(categoryData);
      formData.reset();
    } else if (this.formStatus == 'Edit') {
      this.categoriesService.updateData(this.categoryId, categoryData);
      formData.reset();
      this.formStatus = 'Add';
    }

    // this.afs
    //   .collection('categories')
    //   .add(categoryData)
    //   .then((docRef) => {
    //     console.log(docRef);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }
  onEdit(category: string, id: string) {
    this.formCategory = category;
    this.formStatus = 'Edit';
    this.categoryId = id;
  }
  onDelete(id) {
    this.categoriesService.deleteData(id);
  }
}
