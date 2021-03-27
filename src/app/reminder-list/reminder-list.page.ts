import { Component, OnInit,  } from "@angular/core";
import { FormArray, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { ReminderListService } from "./reminder-list.service";
import * as firebase from "firebase";

@Component({
    selector: 'app-reminder-list',
    templateUrl: './reminder-list.page.html',
    styleUrls: [
      './styles/reminder-list.page.scss',
      './styles/reminder-list.shell.scss'
    ]
  })
export class ReminderListPage implements OnInit {

    back="app/categories";
    user: any;
    is_Submitted = false;
    Sizes = ['small','medium','large'];
    doc_id="";

    reminderlistForm = this.fb.group({
      user_id : ['' , []],
      title: ['',[Validators.required]],
      date: ['',[Validators.required]],
      text: ['',[]],
    });

    constructor(private route: ActivatedRoute,
      private reminderlistService: ReminderListService,
      private router: Router,
      private fb : FormBuilder,
      public alertController: AlertController
      ) { }

    ngOnInit(): void {

      this.user = firebase.auth().currentUser;
      this.form.user_id.setValue(this.user.uid);
      
      this.doc_id =  this.route.snapshot.paramMap.get('doc_id');
      // Get Reminder
      if(this.doc_id){
        this.reminderlistService.getReminderByDocId(this.doc_id)
        .then((state) => {
          if(state.status && state.data){
            this.reminderlistForm.patchValue({
              user_id: this.user.uid,
              title:state.data.title,
              date:state.data.date,
              text:state.data.text,
            });
          }
        }, (error) => console.log(error));
      }
      
    }

    onSubmit() {

      this.is_Submitted =true;
      if(this.reminderlistForm.valid){
        this.is_Submitted = false;
        var values = this.reminderlistForm.value;
        this.reminderlistService.saveReminderList(values,this.doc_id).then(res=>{
          if(res.status){
            this.onBack();
          }
        });
      }
    }



    get form(){
      return this.reminderlistForm.controls;
    }

    private get reminderlistArr(): FormArray {
      return this.reminderlistForm.get('reminderlist') as FormArray;
    };

    loadReminder(response){
    if(response.status && response.data){
      response.data.forEach((element,index) => {
        if(index==0){
          if(element.reminderlist){
            element.reminderlist.forEach(item => {
              this.addControl(item.title,item.date,item.text);
            });
          }
        }
      });
    }
  }
  addControl(title='',date=null,text=""){

    var ctr = this.fb.group({
      title: [title,[Validators.required]],
      date: [date,[Validators.required]],
      text: [text,[]],
    });
    
    this.reminderlistArr.push(ctr);
  }


  
  onAddNew(){
    this.addControl();
  }
  
  
  onRemove() {

     this.reminderlistService.removeReminder(this.doc_id).then(res=>{
       if(res.status)
          this.onBack();
     })
  }

  onBack()
  {
    this.router.navigate([this.back], {  replaceUrl: true});
  }
}