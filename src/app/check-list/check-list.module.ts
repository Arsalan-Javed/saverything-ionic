import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';
import { CheckListService } from './check-list.service';
import { CheckListPage } from './check-list.page';


const routes: Routes = [
  {
    path: '',
    component: CheckListPage,
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
    CheckListPage
  ],
  providers: [
    CheckListService
  ]
})
export class CheckListModule {}
