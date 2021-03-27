import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { DataStore } from '../shell/data-store';
import { TransferStateHelper } from '../utils/transfer-state-helper';
import { isPlatformServer } from '@angular/common';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { PostDetailsModel } from '../posts/details/post-details.model';
import { PostListingModel } from '../posts/listing/post-listing.model';

@Injectable()
export class CheckListService {

  // Collection Names
  private readonly CHECKLIST = 'CheckList';

  private listingDataStore: DataStore<PostListingModel>;
  private detailsDataStore: DataStore<PostDetailsModel>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferStateHelper: TransferStateHelper,
    private http: HttpClient,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) { }

  public saveCheckList(checklist,doc_id){

    var $this = this;
    return new Promise<any>((resolve, reject) => {

        if(doc_id){
          $this.afs.collection($this.CHECKLIST).doc(doc_id).update(checklist).then(function (docRef) {

            resolve({status:true, message:'Saved Successfully'});

          }).catch(function (error){ 
              resolve({status:false, message:error});
          });
        }
        else{
          $this.afs.collection($this.CHECKLIST).add(checklist).then(function (docRef) {

            resolve({status:true, message:'Saved Successfully'});

          }).catch(function (error){ 
              resolve({status:false, message:error});
          });
        }
     });
  }

  public getUserChecklist(user_id){

    var $this = this;
    return new Promise<any>((resolve, reject) => {

      $this.afs.collection($this.CHECKLIST, ref => ref.where('user_id', '==', user_id)).snapshotChanges()
      .subscribe(res=>{
          let data  = res.map(p => { return { doc_id: p.payload.doc.id, ...p.payload.doc.data() as {} } });
          resolve({status:true, data:data});
        });
     });
  }


  
}
