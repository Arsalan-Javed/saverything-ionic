import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { assign } from 'core-js/fn/object';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IResolvedRouteData, ResolverHelper } from '../utils/resolver-helper';
import { CategoriesModel } from './categories.model';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: [
    './styles/categories.page.scss',
    './styles/categories.shell.scss',
    './styles/categories.responsive.scss'
  ]
})
export class CategoriesPage { 

  subscriptions: Subscription;

  listing: CategoriesModel;
  colors = ['red','green','pink','yellow','blue']; // also include css class
  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  constructor(private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.subscriptions = this.route.data
    .pipe(
      // Extract data for this page
      switchMap((resolvedRouteData: IResolvedRouteData<CategoriesModel>) => {
        return ResolverHelper.extractData<CategoriesModel>(resolvedRouteData.data, CategoriesModel);
      })
    )
    .subscribe((state) => {
      this.listing = state;
      this.listing.items.forEach((element,index) => {
        if(element.size=='medium' || element.size=='large' || element.size == '12')
        {
          element.size = '12';
          element.ratio = element.order == 1 ? {w:75, h:49} : {w:75, h:30};
        }
        else{
          element.size = '6';
          element.ratio = {w:1, h:1};
        }
        element.class = this.colors[Math.floor((Math.random() * this.colors.length) - 1)] + '-category';
        element.src = './assets/sample-images/categories/' + element.name + '.png';
      });
      this.listing.items.sort((a, b) => {
        return a.order - b.order;
      });
    }, (error) => console.log(error));
  }


  openCategory(category_id){
    this.router.navigate(['app/categories/posts/'+category_id], { replaceUrl: true });
  }
  
  
}
