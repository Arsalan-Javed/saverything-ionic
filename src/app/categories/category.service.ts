import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { DataStore } from '../shell/data-store';
import { TransferStateHelper } from '../utils/transfer-state-helper';
import { isPlatformServer } from '@angular/common';
import { CategoriesModel } from './categories.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class CategoryService {
  private listingDataStore: DataStore<CategoriesModel>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferStateHelper: TransferStateHelper,
    private http: HttpClient,
    private afs: AngularFirestore,
  ) { }

    // Collection Names
    private readonly CATEGORIES = 'Categories';

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


}
