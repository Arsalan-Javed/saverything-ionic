import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { IResolvedRouteData, ResolverHelper } from '../../utils/resolver-helper';
import { FoodListingModel } from './food-listing.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-food-listing',
  templateUrl: './food-listing.page.html',
  styleUrls: [
    './styles/food-listing.page.scss',
    './styles/food-listing.shell.scss'
  ]
})
export class FoodListingPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;

  listing: FoodListingModel;
  category_id = "";

  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {

    this.category_id = this.route.snapshot.paramMap.get('category_id');

    this.subscriptions = this.route.data
    .pipe(
      // Extract data for this page
      switchMap((resolvedRouteData: IResolvedRouteData<FoodListingModel>) => {
        return ResolverHelper.extractData<FoodListingModel>(resolvedRouteData.data, FoodListingModel);
      })
    )
    .subscribe((state) => {
      this.listing = state;
    }, (error) => console.log(error));
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    if(this.subscriptions)
      this.subscriptions.unsubscribe();
  }

  openAddFood(): void {
    this.router.navigate(['app/categories/food/add-food/'+this.category_id], {  replaceUrl: true});
  }

}
