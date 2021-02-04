import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';
import { PostDetailsPage } from './post-details.page';
import { PostDetailsResolver } from './post-details.resolver';
import { PostService } from '../post.service';


const routes: Routes = [
  {
    path: '',
    component: PostDetailsPage,
    resolve: {
      data: PostDetailsResolver
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    PipesModule
  ],
  declarations: [
    PostDetailsPage
  ],
  providers: [
    PostDetailsResolver,
    PostService
  ]
})
export class PostDetailsPageModule {}
