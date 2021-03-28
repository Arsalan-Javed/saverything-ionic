import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { DataStore } from '../shell/data-store';
import { TransferStateHelper } from '../utils/transfer-state-helper';
import { isPlatformServer } from '@angular/common';
import { CategoriesModel } from './categories.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { HomeItemModel, HomeModel } from './home.model';
import { CheckListService } from '../check-list/check-list.service';
import { ReminderListService } from '../reminder-list/reminder-list.service';

@Injectable()
export class CategoryService {
  private listingDataStore: DataStore<CategoriesModel>;
  private homeDataStore: DataStore<HomeModel>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferStateHelper: TransferStateHelper,
    private http: HttpClient,
    private afs: AngularFirestore,
    private checkListService: CheckListService,
    private reminderListService: ReminderListService,
  ) { }

    // Collection Names
    private readonly CATEGORIES = 'Categories';
    private readonly PREFERENCES = 'Preferences';

  public getListingDataSource(): Observable<CategoriesModel> {

    const rawDataSource = new Observable<CategoriesModel>(observer => {

      this.afs.collection(this.CATEGORIES).snapshotChanges()
      .subscribe(res=>{
          let data  = res.map(p => { return { id: p.payload.doc.id, ...p.payload.doc.data() as {} } });
          if (data && data.length > 0) {
          }
          const listing = new CategoriesModel();
          Object.assign(listing.items, data);
    
          observer.next(listing);
          observer.complete();
        })

      
      });
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('food-listing-state', rawDataSource);

    return cachedDataSource;

    // const rawDataSource = this.http.get<CategoriesModel>('./assets/sample-data/food/categories.json')
    // .pipe(
    //   map(
    //     (data: CategoriesModel) => {
    //       const listing = new CategoriesModel();
    //       Object.assign(listing, data);
    //       return listing;
    //     }
    //   )
    // );

    // This method tapps into the raw data source and stores the resolved data in the TransferState, then when
    // transitioning from the server rendered view to the browser, checks if we already loaded the data in the server to prevent
    // duplicate http requests.
    // const cachedDataSource = this.transferStateHelper.checkDataSourceState('categories-listing', rawDataSource);

    // return cachedDataSource;
  }

  public getListingStore(dataSource: Observable<CategoriesModel>): DataStore<CategoriesModel> {
    // Use cache if available
    //if (!this.listingDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: CategoriesModel = new CategoriesModel();
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
    //}
    return this.listingDataStore;
  }

  public getHomeDataSource(user_id): Observable<HomeModel> {


    const rawDataSource = new Observable<HomeModel>(observer => {
        
      let api_1 = this.getUserCheckList(user_id);
      let api_2 = this.getUserReminder(user_id);
      let api_3 = this.getCategoriesList();
      let api_4 = this.getUserPreference(user_id);
        forkJoin(
          [api_1,api_2,api_3,api_4]
        ).subscribe(res=>{
          var  dataObject = new HomeModel();
          Object.assign(dataObject.Item.UserCheckLists, res[0]);
          Object.assign(dataObject.Item.UserReminders, res[1]);
          Object.assign(dataObject.Item.CategoriesList, res[2]);
          Object.assign(dataObject.Item.UserPreferences, res[3]);
          observer.next(dataObject);
          observer.complete();
        });
    });

    const cachedDataSource = this.transferStateHelper.checkDataSourceState('home-data-state', rawDataSource);

    return cachedDataSource;
  }

  public getHomeStore(dataSource: Observable<HomeModel>): DataStore<HomeModel> {
    // Use cache if available
    //if (!this.homeDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: HomeModel = new HomeModel();
      this.homeDataStore = new DataStore(shellModel);

      // If running in the server, then don't add shell to the Data Store
      // If we already loaded the Data Source in the server, then don't show a shell when transitioning back to the broswer from the server
      if (isPlatformServer(this.platformId) || dataSource['ssr_state']) {
        // Trigger loading mechanism with 0 delay (this will prevent the shell to be shown)
        this.homeDataStore.load(dataSource, 0);
      } else { // On browser transitions
        // Trigger the loading mechanism (with shell)
        this.homeDataStore.load(dataSource);
      }
    //}
    return this.homeDataStore;
  }

  public getCategoriesList(){

    return new Observable<any>(observer => {

      this.afs.collection(this.CATEGORIES).snapshotChanges()
      .subscribe(res=>{
          let data  = res.map(p => { return { id: p.payload.doc.id, ...p.payload.doc.data() as {} } });
          if (data && data.length > 0) {
            observer.next(data);
          }
          else{
            observer.next([]);
          }
          observer.complete();
        })

    });
  }

  public getUserCheckList(user_id){
    return new Observable<any>(observer => {

      this.checkListService.getUserChecklist(user_id).then(res=>{
          var data = res.data && res.data.length>0? res.data[0] : {};
          observer.next(data);
          observer.complete();

      }).catch(error=>{
        observer.next({});
        observer.complete();
      });

    });

  }

  public getUserReminder(user_id){
    return new Observable<any>(observer => {

      this.reminderListService.getUsersReminders(user_id).then(res=>{
          observer.next(res.data);
          observer.complete();

      }).catch(error=>{
        observer.next([]);
        observer.complete();
      });

    });

  }
  public getUserPreference(user_id){

    return new Observable<any>(observer => {

      this.afs.collection(this.PREFERENCES, ref => ref.where('user_id', '==', user_id)).snapshotChanges()
      .subscribe(res=>{
          let data  = res.map(p => { return { doc_id: p.payload.doc.id, ...p.payload.doc.data() as {} } });
          if(data && data.length>0){
            observer.next(data[0]);
          }
          else{
            observer.next(null);
          }
          observer.complete();
        });

    });

  }

  public saveUserPreference(preference){

    var $this = this;
    return new Promise<any>((resolve, reject) => {

      $this.afs.collection($this.PREFERENCES, ref => ref.where('user_id', '==', preference.user_id)).snapshotChanges()
      .subscribe(res=>{
          let data  = res.map(p => { return { doc_id: p.payload.doc.id, ...p.payload.doc.data() as {} } });
          if(data && data.length>0){
           // update 
            $this.afs.collection($this.PREFERENCES).doc(data[0].doc_id).update(preference).then(function (docRef) {

              resolve({status:true, message:'Saved Successfully'});

            }).catch(function (error){ 
                resolve({status:false, message:error});
            });
          }
          else{
            // Add
            $this.afs.collection($this.PREFERENCES).add(preference).then(function (docRef) {

              resolve({status:true, message:'Saved Successfully'});
  
            }).catch(function (error){ 
                resolve({status:false, message:error});
            });

          }
        });

    });

  }


}
