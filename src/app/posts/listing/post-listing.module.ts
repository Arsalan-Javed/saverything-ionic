import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

import { PostService } from '../post.service';
import { PostListingPage } from './post-listing.page';
import { PostListingResolver } from './post-listing.resolver';

const routes: Routes = [
  {
    path: '',
    component: PostListingPage,
    resolve: {
      data: PostListingResolver
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
    PostListingPage
  ],
  providers: [
    PostListingResolver,
    PostService
  ]
})
export class PostListingPageModule {}
