import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../components/components.module';

import { CategoriesPage } from './categories.page';
import { CategoryResolver } from './categories.resolver';
import { CategoryService } from './category.service';
import { ReminderListService } from '../reminder-list/reminder-list.service';
import { CheckListService } from '../check-list/check-list.service';
import { PipesModule } from '../pipes/pipes.module';

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
    ComponentsModule,
    PipesModule
  ],
  declarations: [ CategoriesPage ],
  providers: [
    CategoryResolver,
    CategoryService,
    CheckListService,
    ReminderListService
  ]
})
export class CategoriesPageModule {}
