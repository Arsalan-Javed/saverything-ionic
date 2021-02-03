import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DataStore } from '../../shell/data-store';
import { FoodService } from '../food.service';
import { FoodListingModel } from './food-listing.model';

@Injectable()
export class FoodListingResolver implements Resolve<DataStore<FoodListingModel>> {

  constructor(private foodService: FoodService) {}

  resolve(route: ActivatedRouteSnapshot): DataStore<FoodListingModel> {
    const category_id = route.paramMap.get('category_id');
    const dataSource: Observable<FoodListingModel> = this.foodService.getListingDataSource(category_id);
    const dataStore: DataStore<FoodListingModel> = this.foodService.getListingStore(dataSource);

    return dataStore;
  }
}
