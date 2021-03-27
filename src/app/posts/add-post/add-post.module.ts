import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

import { PostService } from '../post.service';
import { AddPostResolver } from './add-post.resolver';
import { AddPostPage } from './add-post.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from  '../../categories/category.service';


const routes: Routes = [
  {
    path: '',
    component: AddPostPage,
    resolve: {
      data: AddPostResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AddPostPage
  ],
  providers: [
    AddPostResolver,
    PostService,
    CategoryService,
  ]
})
export class AddPostPageModule {}
