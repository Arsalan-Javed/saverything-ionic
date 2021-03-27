import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';
import { ReminderListPage } from './reminder-list.page';
import { ReminderListService } from './reminder-list.service';


const routes: Routes = [
  {
    path: '',
    component: ReminderListPage,
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
    ReminderListPage
  ],
  providers: [
    ReminderListService
  ]
})
export class ReminderListModule {}
