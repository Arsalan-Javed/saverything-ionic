import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { DataStore } from '../shell/data-store';
import { FoodListingModel } from './listing/food-listing.model';
import { FoodDetailsModel } from './details/food-details.model';
import { TransferStateHelper } from '../utils/transfer-state-helper';
import { isPlatformServer } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AddFoodItemModel } from './add-food/add-food.model';

@Injectable()
export class FoodService {

  // Collection Names
  private readonly POSTS = 'Posts';

  private listingDataStore: DataStore<FoodListingModel>;
  private detailsDataStore: DataStore<FoodDetailsModel>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferStateHelper: TransferStateHelper,
    private http: HttpClient,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) { }

  public getListingDataSource(category_id): Observable<FoodListingModel> {
    
    const rawDataSource = new Observable<FoodListingModel>(observer => {

      this.afs.collection(this.POSTS, ref => ref.where('category_id', '==', category_id)).snapshotChanges()
      .subscribe(res=>{
          let data  = res.map(p => { return { post_id: p.payload.doc.id, ...p.payload.doc.data() as {} } });
          if (data && data.length > 0) {
          }
          const listing = new FoodListingModel();
          Object.assign(listing.items, data);
    
          observer.next(listing);
          observer.complete();
        })

      
      });
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('food-listing-state', rawDataSource);

    return cachedDataSource;
  }

  public getListingStore(dataSource: Observable<FoodListingModel>): DataStore<FoodListingModel> {
    // Use cache if available
    if (!this.listingDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: FoodListingModel = new FoodListingModel();
      this.listingDataStore = new DataStore(shellModel);

      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.listingDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.listingDataStore.load(dataSource);
      }
    }
    return this.listingDataStore;
  }

  public getDetailsDataSource(post_id: string): Observable<FoodDetailsModel> {

    const rawDataSource = new Observable<FoodDetailsModel>(observer => {

      this.afs.doc(this.POSTS + '/' + post_id).ref.get().then(res=>{
            const details = new FoodDetailsModel();
            if (res.exists && res.data()) {
              let data  = res.data();
              data['post_id'] = post_id;
              Object.assign(details, data);
            }
            observer.next(details);
            observer.complete();
          
        })

      
      });
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('food-listing-state', rawDataSource);

    return cachedDataSource;

    // const rawDataSource = this.http.get<{items: Array<FoodDetailsModel>}>('./assets/sample-data/food/details.json')
    // .pipe(
    //   mergeMap(details => details.items.filter(item => item.slug === slug)),
    //   map(
    //     (data: FoodDetailsModel) => {
    //       // Note: HttpClient cannot know how to instantiate a class for the returned data
    //       // We need to properly cast types from json data
    //       const details = new FoodDetailsModel();

    //       // The Object.assign() method copies all enumerable own properties from one or more source objects to a target object.
    //       // Note: If you have non-enummerable properties, you can try a spread operator instead. details = {...data};
    //       // (see: https://scotch.io/bar-talk/copying-objects-in-javascript#toc-using-spread-elements-)
    //       Object.assign(details, data);

    //       return details;
    //     }
    //   )
    // );

    // // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // // duplicate http requests.
    // const cachedDataSource = this.transferStateHelper.checkDataSourceState('food-details-state', rawDataSource);

    // return cachedDataSource;
  }

  public getDetailsStore(dataSource: Observable<FoodDetailsModel>): DataStore<FoodDetailsModel> {
    // Initialize the model specifying that it is a shell model
    const shellModel: FoodDetailsModel = new FoodDetailsModel();
    this.detailsDataStore = new DataStore(shellModel);

    // If running in the server, then don't add shell to the Data Store
    // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
    if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
      // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
      this.detailsDataStore.load(dataSource, 0);
    } else { // On browser transitions
      // Trigger the loading mechanism (with shell)
      this.detailsDataStore.load(dataSource);
    }

    return this.detailsDataStore;
  }

  public saveFood(food){

    var $this = this;
    return new Promise<any>((resolve, reject) => {
      $this.saveFiles([food.title_picture],food.category_id).then(title_response=>{
        if(title_response.status){
          $this.saveFiles(food.additional_pictures,food.category_id).then(additional_response=>{
            if(additional_response.status){
              food.title_picture = title_response.filepaths.length>0 ? title_response.filepaths[0] : "";

              var existing_images = food.additional_pictures.filter(p=>p.is_existing==true).map(p=>p.result);
              food.additional_pictures =  additional_response.filepaths.concat(existing_images);
              
              if(food.post_id){ // Edit

                if(!food.title_picture)
                   delete food.title_picture;
                if(food.additional_pictures.length<=0)
                   delete food.additional_pictures;

                var post_id =  food.post_id;
                delete food.post_id;
                this.afs.collection(this.POSTS).doc(post_id).update(food).then(res => {
                  resolve({status:true, message:'Posted Successfully'});
                }).catch(function (error) { resolve({status:false, message:error});});
  

              }
              else{
                delete food.post_id;
                $this.afs.collection($this.POSTS).add(food).then(function (docRef) {
                  resolve({status:true, message:'Posted Successfully'});
                }).catch(function (error) { resolve({status:false, message:error});});
              }
            }
            else
              resolve({status:false, message:'Additional Images not saved'});
          });
        }
        else
          resolve({status:false, message:'Title Image not saved'});
      });
     });
  }

  saveFiles(files,category_id){

    var $this = this;
    return new Promise<any>((resolve, reject) => {
      var filepaths = [];
      if(files.length<=0)
         resolve({status:true, filepaths:filepaths});

      files.forEach((obj,index) => {
        if(obj && obj.file){
          var file = obj.file;
          const fileStoragePath = $this.POSTS +'/catId_'+ category_id +`/${new Date().getTime()}_${file.name}`;
          const imageRef = $this.afStorage.ref(fileStoragePath);
          // File upload task
          $this.afStorage.upload(fileStoragePath, file).then(res=>{
            var img_url = imageRef.getDownloadURL();
            img_url.subscribe(resp=>{
              filepaths.push(resp);
                if(files.length==index+1)
                   resolve({status:true, filepaths:filepaths});
              },error=>{
                resolve({status:false, filepaths:filepaths});
              })
          });
        }
        else{
          if(files.length==index+1)
             resolve({status:true, filepaths:filepaths});
        }
        
      });
    });
    
  }

  deletePost(post_id){
    var $this = this;
    return new Promise<any>((resolve, reject) => {

      this.getDetailsDataSource(post_id).subscribe(res=>{
            
        if(res.title_picture)
            $this.afStorage.storage.refFromURL(res.title_picture).delete();

        res.additional_pictures.forEach(element => {
          if(element)
             $this.afStorage.storage.refFromURL(element).delete();
        });

        this.afs.collection($this.POSTS).doc(post_id).delete().then(function() {
          resolve({status:true, message:'Post successfully deleted'});
        }).catch(function(error) {
          resolve({status:false, message:error});
        });
        
      });
      
    });
    
  }
  
}
