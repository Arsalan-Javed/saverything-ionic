import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { IResolvedRouteData, ResolverHelper } from '../../utils/resolver-helper';
import { FoodDetailsModel } from './food-details.model';
import { switchMap } from 'rxjs/operators';
import { FoodService } from '../food.service';

@Component({
  selector: 'app-food-details',
  templateUrl: './food-details.page.html',
  styleUrls: [
    './styles/food-details.page.scss',
    './styles/food-details.shell.scss'
  ]
})
export class FoodDetailsPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;

  details: FoodDetailsModel;
  back="";

  @HostBinding('class.is-shell') get isShell() {
    return (this.details && this.details.isShell) ? true : false;
  }

  
  constructor(private route: ActivatedRoute,private router: Router,private foodService: FoodService) { }

  ngOnInit(): void {
    this.subscriptions = this.route.data
    .pipe(
      // Extract data for this page
      switchMap((resolvedRouteData: IResolvedRouteData<FoodDetailsModel>) => {
        return ResolverHelper.extractData<FoodDetailsModel>(resolvedRouteData.data, FoodDetailsModel);
      })
    )
    .subscribe((state) => {
      this.details = state;
      this.back= "app/categories/food/"+this.details.category_id;
    }, (error) => console.log(error));
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    this.subscriptions.unsubscribe();
  }

  editPost(post_id){

    this.router.navigate(['app/categories/food/edit-food/'+post_id], {  replaceUrl: true});

  }

  deletePost(post_id){
     this.foodService.deletePost(post_id).then(res=>{
       if(res.status)
          this.router.navigate([this.back], { replaceUrl: true});
     })
  }
}
