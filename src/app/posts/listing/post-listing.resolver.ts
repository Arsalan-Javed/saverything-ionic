import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../../shell/data-store';
import { PostService } from '../post.service';
import { PostListingModel } from './post-listing.model';

@Injectable()
export class PostListingResolver implements Resolve<DataStore<PostListingModel>> {

  constructor(private postService: PostService) {}

  resolve(route: ActivatedRouteSnapshot): DataStore<PostListingModel> {
    const category_id = route.paramMap.get('category_id');
    const dataSource: Observable<PostListingModel> = this.postService.getListingDataSource(category_id);
    const dataStore: DataStore<PostListingModel> = this.postService.getListingStore(dataSource);

    return dataStore;
  }
}
