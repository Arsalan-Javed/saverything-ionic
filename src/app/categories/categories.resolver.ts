import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { DataStore } from '../shell/data-store';
import { CategoryService } from './category.service';
import { CategoriesModel } from './categories.model';
import * as firebase from "firebase";
import { HomeItemModel, HomeModel } from './home.model';

@Injectable()
export class CategoryResolver implements Resolve<DataStore<HomeModel>> {

  constructor(private categoryService: CategoryService) {}

  resolve(): DataStore<HomeModel> {

    var user_id = firebase.auth().currentUser.uid;

    // const dataSource: Observable<CategoriesModel> = this.categoryService.getListingDataSource();
    // const dataStore: DataStore<CategoriesModel> = this.categoryService.getListingStore(dataSource);

    // return dataStore;

    const dataSource: Observable<HomeModel> = this.categoryService.getHomeDataSource(user_id);
    const dataStore: DataStore<HomeModel> = this.categoryService.getHomeStore(dataSource);

    return dataStore;
  }
}
