import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DataStore } from '../shell/data-store';
import { PostListingModel } from './listing/post-listing.model';
import { TransferStateHelper } from '../utils/transfer-state-helper';
import { isPlatformServer } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { PostDetailsModel } from './details/post-details.model';

@Injectable()
export class PostService {

  // Collection Names
  private readonly POSTS = 'Posts';
  private readonly CATEGORIES = 'Categories';

  private listingDataStore: DataStore<PostListingModel>;
  private detailsDataStore: DataStore<PostDetailsModel>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferStateHelper: TransferStateHelper,
    private http: HttpClient,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) { }

  public getListingDataSource(category_id): Observable<PostListingModel> {
    
    const rawDataSource = new Observable<PostListingModel>(observer => {

      this.afs.collection(this.POSTS, ref => ref.where('category_id', '==', category_id)).snapshotChanges()
      .subscribe(res=>{
          let data  = res.map(p => { return { post_id: p.payload.doc.id, ...p.payload.doc.data() as {} } });
          if (data && data.length > 0) {
          }
          const listing = new PostListingModel();
          Object.assign(listing.items, data);
    
          observer.next(listing);
          observer.complete();
        })

      
      });
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('posts-listing-state', rawDataSource);

    return cachedDataSource;
  }

  public getListingStore(dataSource: Observable<PostListingModel>): DataStore<PostListingModel> {
    // Use cache if available
    if (!this.listingDataStore) {
      // Initialize the model specifying that it is a shell model
      const shellModel: PostListingModel = new PostListingModel();
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

  public getDetailsDataSource(post_id: string): Observable<PostDetailsModel> {

    const rawDataSource = new Observable<PostDetailsModel>(observer => {

      this.afs.doc(this.POSTS + '/' + post_id).ref.get().then(res=>{
            const details = new PostDetailsModel();
            if (res.exists && res.data()) {
              let data  = res.data();
              data['post_id'] = post_id;
              Object.assign(details, data);
            }
            observer.next(details);
            observer.complete();
          
        })

      
      });
      const cachedDataSource = this.transferStateHelper.checkDataSourceState('post-detail-state', rawDataSource);

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

  public getDetailsStore(dataSource: Observable<PostDetailsModel>): DataStore<PostDetailsModel> {
    // Initialize the model specifying that it is a shell model
    const shellModel: PostDetailsModel = new PostDetailsModel();
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

  public savePost(post){

    var $this = this;
    return new Promise<any>((resolve, reject) => {
      $this.saveFiles([post.title_picture],post.category_id).then(title_response=>{
        if(title_response.status){
          $this.saveFiles(post.additional_pictures,post.category_id).then(additional_response=>{
            
            if(additional_response.status){

              if(post.order.filter(p=>p.type=='img' && !p.is_existing).length>0)
              {
                //save other images
                $this.saveFiles(post.order.filter(p=>p.type=='img' && !p.is_existing).map(p=>({file:p.file})),post.category_id).then(other_response=>{
                  if(other_response.status){
                    $this.doPost($this,resolve,post,title_response,additional_response,other_response);
                  }
                  else{
                    resolve({status:false, message:'Other Images not saved'});
                  }
                });
              }
              else{
                  $this.doPost($this,resolve,post,title_response,additional_response);
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

  doPost($this,resolve,post,title_response,additional_response,other_response=null){
    post.title_picture = title_response.filepaths.length>0 ? title_response.filepaths[0] : "";

    var existing_images = post.additional_pictures.filter(p=>p.is_existing==true).map(p=>p.result);
    post.additional_pictures =  additional_response.filepaths.concat(existing_images);
    
    if(other_response){
      post.order.filter(p=>p.type=='img' && !p.is_existing).forEach((element,index) => {
        element.value = other_response.filepaths[index] ? other_response.filepaths[index] : '';
        delete element['file']; 
      });
    }

    if(post.post_id){ // Edit

      if(!post.title_picture)
         delete post.title_picture;
      if(post.additional_pictures.length<=0)
         delete post.additional_pictures;

      var post_id =  post.post_id;
      delete post.post_id;
      this.afs.collection(this.POSTS).doc(post_id).update(post).then(res => {
        resolve({status:true, message:'Posted Successfully'});
      }).catch(function (error) { resolve({status:false, message:error});});


    }
    else{
      delete post.post_id;
      $this.afs.collection($this.POSTS).add(post).then(function (docRef) {
        resolve({status:true, message:'Posted Successfully'});
      }).catch(function (error) { resolve({status:false, message:error});});
    }
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

  addCategory(category){
    var $this = this;
    return new Promise<any>((resolve, reject) => {

      $this.afs.collection($this.CATEGORIES).add(category).then(function (docRef) {

        resolve({status:true, message:'Saved Successfully',category_id:docRef.id});

      }).catch(function (error) { resolve({status:false, message:error});});

    });
    
  }

  removeImage(url){
    if(url)
      this.afStorage.storage.refFromURL(url).delete();
  }
  
}
