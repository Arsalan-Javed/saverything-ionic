import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { assign } from 'core-js/fn/object';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IResolvedRouteData, ResolverHelper } from '../utils/resolver-helper';
import { CategoriesModel } from './categories.model';
import { HomeItemModel, HomeModel } from './home.model';

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
  homeDate: HomeModel;

  colors = ['red','green','pink','yellow','blue']; // also include css class
  @HostBinding('class.is-shell') get isShell() {
    return (this.listing && this.listing.isShell) ? true : false;
  }

  items: any[] = [];
  lorem = '28-05-2020';
  rotateImg;

  images = [
    'bandit',
    'batmobile',
    'blues-brothers',
    'bueller',
    'delorean',
    'eleanor',
    'general-lee',
    'ghostbusters',
    'knight-rider',
    'mirth-mobile'
  ];
  
  constructor(private route: ActivatedRoute,private router: Router) {

    for (let i = 0; i < 100; i++) {
      this.items.push({
        name: this.images[Math.floor(Math.random() * Math.floor(this.lorem.length-1))],
        imgSrc: this.getImgSrc(),
        avatarSrc: this.getImgSrc(),
        imgHeight: Math.floor(Math.random() * 50 + 150),
        content: this.lorem.substring(0, Math.random() * (this.lorem.length - 100) + 100)
      });

      this.rotateImg++;
      if (this.rotateImg === this.images.length) {
        this.rotateImg = 0;
      }
    }
   }

  


  ngOnInit(): void {
    this.subscriptions = this.route.data
    .pipe(
      // Extract data for this page
      switchMap((resolvedRouteData: IResolvedRouteData<HomeModel>) => {
        return ResolverHelper.extractData<HomeModel>(resolvedRouteData.data, HomeModel);
      })
    )
    .subscribe((state) => {

      this.homeDate = state;
    //   this.listing = state;
    //   this.listing.items.forEach((element,index) => {
    //     if(element.size=='medium' || element.size=='large' || element.size == '12')
    //     {
    //       element.size = '12';
    //       element.ratio = element.order == 1 ? {w:75, h:49} : {w:75, h:30};
    //     }
    //     else{
    //       element.size = '6';
    //       element.ratio = {w:1, h:1};
    //     }
    //     element.class = this.colors[Math.floor((Math.random() * this.colors.length) - 1)] + '-category';
    //     element.src = './assets/sample-images/categories/' + element.name + '.png';
    //   });
    //   this.listing.items.sort((a, b) => {
    //     return a.order - b.order;
    //   });

     }, (error) => console.log(error));
  }


  openCategory(category_id){
    this.router.navigate(['app/categories/posts/'+category_id], { replaceUrl: true });
  }
  
  editReminder(item){
    this.router.navigate(['app/reminder/'+item.doc_id], { replaceUrl: true });
  }
  getImgSrc() {
    
    const src = 'https://dummyimage.com/600x400/${Math.round( Math.random() * 99999)}/fff.png';
    this.rotateImg++;
    if (this.rotateImg === this.images.length) {
      this.rotateImg = 0;
    }
    return src;
  }

  onCheckList()
  {
    this.router.navigate(['app/check-list'], {  replaceUrl: true});
  }

  onReminderList(){
    this.router.navigate(['app/reminder'], {  replaceUrl: true});
  }

  
}
