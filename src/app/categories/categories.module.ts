import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../components/components.module';

import { CategoriesPage } from './categories.page';
import { CategoryResolver } from './categories.resolver';
import { CategoryService } from './category.service';

const categoriesRoutes: Routes = [
  {
    path: '',
    component: CategoriesPage,
    resolve: {
      data: CategoryResolver
    }
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    RouterModule.forChild(categoriesRoutes),
    ComponentsModule
  ],
  declarations: [ CategoriesPage ],
  providers: [
    CategoryResolver,
    CategoryService
  ]
})
export class CategoriesPageModule {}
