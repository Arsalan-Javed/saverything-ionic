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
export class ReminderListService {

  // Collection Names
  private readonly REMINDERLIST = 'ReminderList';

  private listingDataStore: DataStore<PostListingModel>;
  private detailsDataStore: DataStore<PostDetailsModel>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private transferStateHelper: TransferStateHelper,
    private http: HttpClient,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage
  ) { }

  public saveReminderList(reminderlist,doc_id){

    var $this = this;
    return new Promise<any>((resolve, reject) => {

        if(doc_id){
          $this.afs.collection($this.REMINDERLIST).doc(doc_id).update(reminderlist).then(function (docRef) {

            resolve({status:true, message:'Saved Successfully'});

          }).catch(function (error){ 
              resolve({status:false, message:error});
          });
        }
        else{
          $this.afs.collection($this.REMINDERLIST).add(reminderlist).then(function (docRef) {

            resolve({status:true, message:'Saved Successfully'});

          }).catch(function (error){ 
              resolve({status:false, message:error});
          });
        }
     });
  }

  public getReminderByDocId(doc_id){

    var $this = this;
    return new Promise<any>((resolve, reject) => {

      $this.afs.collection($this.REMINDERLIST).doc(doc_id).snapshotChanges()
      .subscribe(res=>{
          let data  = res.payload.data();
          resolve({status:true, data:data});
        });
     });
  }

  public getUsersReminders(user_id){

    var $this = this;
    return new Promise<any>((resolve, reject) => {

      $this.afs.collection($this.REMINDERLIST, ref => ref.where('user_id', '==', user_id)).snapshotChanges()
      .subscribe(res=>{
          let data  = res.map(p => { return { doc_id: p.payload.doc.id, ...p.payload.doc.data() as {} } });
          resolve({status:true, data:data});
        });
     });
  }

  public removeReminder(doc_id){

    var $this = this;
    return new Promise<any>((resolve, reject) => {

      $this.afs.collection($this.REMINDERLIST).doc(doc_id).delete().then(res=>{
          resolve({status:true, message : "Delete Successfully"});
        });
     });
  }


  
}
