import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { assign } from 'core-js/fn/object';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { IResolvedRouteData, ResolverHelper } from '../utils/resolver-helper';
import { CategoriesModel } from './categories.model';
import { HomeModel } from './home.model';
import { ItemReorderEventDetail } from '@ionic/core';

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

  itemsOrder = [
    {
      name:'reminder',
    },
    {
      name:'categories',
    },
    {
      name:'checklist',
    },
    {
      name:'posts',
    },
  ];

  constructor(private route: ActivatedRoute,private router: Router) {}

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

  loadPosts(item){

  }

  onCheckList()
  {
    this.router.navigate(['app/check-list'], {  replaceUrl: true});
  }

  onReminderList(){
    this.router.navigate(['app/reminder'], {  replaceUrl: true});
  }

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    let draggedItem = this.itemsOrder.splice(ev.detail.from,1)[0];
    this.itemsOrder.splice(ev.detail.to,0,draggedItem)

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  
}
