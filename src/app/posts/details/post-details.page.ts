import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { IResolvedRouteData, ResolverHelper } from '../../utils/resolver-helper';
import { PostDetailsModel } from './post-details.model';
import { switchMap } from 'rxjs/operators';
import { PostService } from '../post.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: [
    './styles/post-details.page.scss',
    './styles/post-details.shell.scss'
  ]
})
export class PostDetailsPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  subscriptions: Subscription;

  details: PostDetailsModel;
  back="";

  @HostBinding('class.is-shell') get isShell() {
    return (this.details && this.details.isShell) ? true : false;
  }

  
  constructor(private route: ActivatedRoute,private router: Router,
    private postService: PostService,private dom : DomSanitizer) { }

  ngOnInit(): void {
    this.subscriptions = this.route.data
    .pipe(
      // Extract data for this page
      switchMap((resolvedRouteData: IResolvedRouteData<PostDetailsModel>) => {
        return ResolverHelper.extractData<PostDetailsModel>(resolvedRouteData.data, PostDetailsModel);
      })
    )
    .subscribe((state) => {
      this.details = state;
      this.back= "app/categories/posts/"+this.details.category_id;
    }, (error) => console.log(error));
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    this.subscriptions.unsubscribe();
  }

  editPost(category_id,post_id){

    this.router.navigate(['app/categories/posts/'+ category_id +'/edit-post/'+ post_id], {  replaceUrl: true});

  }

  deletePost(post_id){
     this.postService.deletePost(post_id).then(res=>{
       if(res.status)
          this.router.navigate([this.back], { replaceUrl: true});
     })
  }

  sanitizer(video){
    return this.dom.bypassSecurityTrustResourceUrl(video);
  }

  onBack()
  {
    this.router.navigate([this.back], {  replaceUrl: true});
  }
}
