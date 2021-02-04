import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoriesModel } from '../../categories/categories.model';
import { CategoryService } from '../../categories/category.service';

import { DataStore } from '../../shell/data-store';

@Injectable()
export class AddPostResolver implements Resolve<DataStore<CategoriesModel>> {

  constructor(private categoryService: CategoryService) {}

  resolve(): DataStore<CategoriesModel> {
    const dataSource: Observable<CategoriesModel> = this.categoryService.getListingDataSource();
    const dataStore: DataStore<CategoriesModel> = this.categoryService.getListingStore(dataSource);
    return dataStore;
  }
}
