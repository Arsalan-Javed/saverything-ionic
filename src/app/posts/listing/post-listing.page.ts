import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { IResolvedRouteData, ResolverHelper } from '../../utils/resolver-helper';
import { PostListingModel } from './post-listing.model';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-post-listing',
  templateUrl: './post-listing.page.html',
  styleUrls: [
    './styles/post-listing.page.scss',
    './styles/post-listing.shell.scss'
  ]
})
export class PostListingPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;

  listing: PostListingModel;

  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    
    this.subscriptions = this.route.data
    .pipe(
      // Extract data for this page
      switchMap((resolvedRouteData: IResolvedRouteData<PostListingModel>) => {
        return ResolverHelper.extractData<PostListingModel>(resolvedRouteData.data, PostListingModel);
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

}
