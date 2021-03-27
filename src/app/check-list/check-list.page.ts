import { Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import { ItemReorderEventDetail } from '@ionic/core';
import { AlertController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { CheckListService } from "./check-list.service";
import { IResolvedRouteData, ResolverHelper } from "../utils/resolver-helper";
import { CategoriesModel } from "../categories/categories.model";
import * as firebase from "firebase";

@Component({
    selector: 'app-check-list',
    templateUrl: './check-list.page.html',
    styleUrls: [
      './styles/check-list.page.scss',
      './styles/check-list.shell.scss'
    ]
  })
export class CheckListPage implements OnInit {

    back="app/categories";
    user: any;
    is_Submitted = false;
    Sizes = ['small','medium','large'];
    doc_id="";

    checklistForm = this.fb.group({
      user_id : ['' , []],
      checklist : this.fb.array([]),
    });

    constructor(private route: ActivatedRoute,
      private checklistService: CheckListService,
      private router: Router,
      private fb : FormBuilder,
      public alertController: AlertController,
      ) { }

    ngOnInit(): void {

      this.user = firebase.auth().currentUser;
      this.form.user_id.setValue(this.user.uid);

      // Get User Check List Data
      this.checklistService.getUserChecklist(this.user.uid)
      .then((state) => {
          
        this.loadChecklist(state);

      }, (error) => console.log(error));
    }

    onSubmit() {

      this.is_Submitted =true;
      if(this.checklistForm.valid){
        this.is_Submitted = false;
        var values = this.checklistForm.value;
        this.checklistService.saveCheckList(values,this.doc_id).then(res=>{
          if(res.status){
            this.onBack();
          }
        });
      }
    }



    get form(){
      return this.checklistForm.controls;
    }

    private get CheckListArr(): FormArray {
      return this.checklistForm.get('checklist') as FormArray;
    };

  loadChecklist(response){
    if(response.status && response.data){
      response.data.forEach((element,index) => {
        if(index==0){
          this.doc_id =  element.doc_id ? element.doc_id : null;
          if(element.checklist){
            element.checklist.forEach(item => {
              this.addControl(item.is_checked,item.title);
            });
          }
        }
      });
    }
  }
  addControl(is_check=false,title=''){

    var ctr = this.fb.group({
      is_checked : [is_check,[]],
      title: [title,[Validators.required]],
    });
    
    this.CheckListArr.push(ctr);
  }


  
  onAddNew(){
    this.addControl();
  }
  
  
  removeControl(index: number = 0) {
    this.CheckListArr.removeAt(index);
  }

  onBack()
  {
    this.router.navigate([this.back], {  replaceUrl: true});
  }
}