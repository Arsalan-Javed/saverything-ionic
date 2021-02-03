import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

import { FoodService } from '../food.service';
import { AddFoodResolver } from './add-food.resolver';
import { AddFoodPage } from './add-food.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: AddFoodPage,
    // resolve: {
    //   data: AddFoodResolver
    // }
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
    AddFoodPage
  ],
  providers: [
    AddFoodResolver,
    FoodService
  ]
})
export class AddFoodPageModule {}
