import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../../shell/data-store';
import { PostService } from '../post.service';
import { PostDetailsModel } from './post-details.model';

@Injectable()
export class PostDetailsResolver implements Resolve<DataStore<PostDetailsModel>> {

  constructor(private postService: PostService) {}

  resolve(route: ActivatedRouteSnapshot): DataStore<PostDetailsModel> {
    const itemSlug = route.paramMap.get('post_id');

    const dataSource: Observable<PostDetailsModel> = this.postService.getDetailsDataSource(itemSlug);
    const dataStore: DataStore<PostDetailsModel> = this.postService.getDetailsStore(dataSource);

    return dataStore;
  }
}
