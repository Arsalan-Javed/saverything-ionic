import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/firebase/auth/sign-in']);

const routes: Routes = [
  {
    path: '',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    component: TabsPage,
    children: [
      // /app/ redirect
      // {
      //   path: '',
      //   redirectTo: 'posts',
      //   pathMatch: 'full'
      // },
      // {
      //   path: 'posts',
      //   children: [
      //     {
      //       path: '',
      //       loadChildren: () => import('../posts/listing/post-listing.module').then(m => m.PostListingPageModule)
      //     },
      //     {
      //       path: 'add-post',
      //       loadChildren: () => import('../posts/add-post/add-post.module').then(m => m.AddPostPageModule)
      //     },
      //     {
      //       path: 'edit-post/:post_id',
      //       loadChildren: () => import('../posts/add-post/add-post.module').then(m => m.AddPostPageModule)
      //     },
      //     {
      //       path: 'post-detail/:post_id',
      //       loadChildren: () => import('../posts/details/post-details.module').then(m => m.PostDetailsPageModule)
      //     },
      //   ]
      // },
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
        path: 'categories',
        children: [
          {
            path: '',
            loadChildren: () => import('../categories/categories.module').then(m => m.CategoriesPageModule)
          },
          {
            path: 'posts/:category_id',
            children: [
              {
                path: '',
                loadChildren: () => import('../posts/listing/post-listing.module').then(m => m.PostListingPageModule)
              },
              {
                path: 'add-post',
                loadChildren: () => import('../posts/add-post/add-post.module').then(m => m.AddPostPageModule)
              },
              {
                path: 'edit-post/:post_id',
                loadChildren: () => import('../posts/add-post/add-post.module').then(m => m.AddPostPageModule)
              },
              {
                path: 'post-detail/:post_id',
                loadChildren: () => import('../posts/details/post-details.module').then(m => m.PostDetailsPageModule)
              },
            ]
          },
          
          // {
          //   path: 'fashion',
          //   loadChildren: () => import('../fashion/listing/fashion-listing.module').then(m => m.FashionListingPageModule)
          // },
          // {
          //   path: 'fashion/:productId',
          //   loadChildren: () => import('../fashion/details/fashion-details.module').then(m => m.FashionDetailsPageModule)
          // },
          // {
          //   path: 'food',
          //   loadChildren: () => import('../food/listing/food-listing.module').then(m => m.FoodListingPageModule)
          // },
          // {
          //   path: 'food/:category_id',
          //   loadChildren: () => import('../food/listing/food-listing.module').then(m => m.FoodListingPageModule)
          // },
          // {
          //   path: 'food/add-food/:category_id',
          //   loadChildren: () => import('../food/add-food/add-food.module').then(m => m.AddFoodPageModule)
          // },
          // {
          //   path: 'food/edit-food/:post_id',
          //   loadChildren: () => import('../food/add-food/add-food.module').then(m => m.AddFoodPageModule)
          // },
          // {
          //   path: 'food-detail/:productId',
          //   loadChildren: () => import('../food/details/food-details.module').then(m => m.FoodDetailsPageModule)
          // },
          // {
          //   path: 'travel',
          //   loadChildren: () => import('../travel/listing/travel-listing.module').then(m => m.TravelListingPageModule)
          // },
          // {
          //   path: 'travel/:productId',
          //   loadChildren: () => import('../travel/details/travel-details.module').then(m => m.TravelDetailsPageModule)
          // },
          // {
          //   path: 'deals',
          //   loadChildren: () => import('../deals/listing/deals-listing.module').then(m => m.DealsListingPageModule)
          // },
          // {
          //   path: 'deals/:productId',
          //   loadChildren: () => import('../deals/details/deals-details.module').then(m => m.DealsDetailsPageModule)
          // },
          // {
          //   path: 'real-estate',
          //   loadChildren: () => import('../real-estate/listing/real-estate-listing.module').then(m => m.RealEstateListingPageModule)
          // },
          // {
          //   path: 'real-estate/:productId',
          //   loadChildren: () => import('../real-estate/details/real-estate-details.module').then(m => m.RealEstateDetailsPageModule)
          // }
        ]
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            loadChildren: () => import('../user/profile/user-profile.module').then(m => m.UserProfilePageModule)
          },
          {
            path: 'friends',
            loadChildren: () => import('../user/friends/user-friends.module').then(m => m.UserFriendsPageModule)
          }
        ]
      },
      {
        path: 'notifications',
        children: [
          {
            path: '',
            loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
          }
        ]
      },
      {
        path: 'add-post',
        loadChildren: () => import('../posts/add-post/add-post.module').then(m => m.AddPostPageModule)
      },
      {
        path: 'check-list',
        loadChildren: () => import('../check-list/check-list.module').then(m => m.CheckListModule)
      },
      {
        path: 'reminder',
        loadChildren: () => import('../reminder-list/reminder-list.module').then(m => m.ReminderListModule)
      },
      {
        path: 'reminder/:doc_id',
        loadChildren: () => import('../reminder-list/reminder-list.module').then(m => m.ReminderListModule)
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [ ]
})
export class TabsPageRoutingModule {}
