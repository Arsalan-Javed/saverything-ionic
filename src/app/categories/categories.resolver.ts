import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStore } from '../shell/data-store';
import { CategoryService } from './category.service';
import { CategoriesModel } from './categories.model';

@Injectable()
export class CategoryResolver implements Resolve<DataStore<CategoriesModel>> {

  constructor(private categoryService: CategoryService) {}

  resolve(): DataStore<CategoriesModel> {
    const dataSource: Observable<CategoriesModel> = this.categoryService.getListingDataSource();
    const dataStore: DataStore<CategoriesModel> = this.categoryService.getListingStore(dataSource);

    return dataStore;
  }
}
