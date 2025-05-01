import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { HomeComponent } from './pages/home/home.component';
import { SingleCategoryComponent } from './pages/single-category/single-category.component';
import { SinglePostsComponent } from './pages/single-posts/single-posts.component';
import { TermsAndConditionComponent } from './pages/terms-and-condition/terms-and-condition.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'category/:category/:id', component: SingleCategoryComponent },
  { path: 'post/:id', component: SinglePostsComponent },

  { path: 'about', component: AboutUsComponent },
  { path: 'term-conditions', component: TermsAndConditionComponent },
  { path: 'contact', component: ContactUsComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
