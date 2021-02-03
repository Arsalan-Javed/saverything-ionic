import { Component, OnInit } from "@angular/core";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ActionSheetOptions } from "@capacitor/core";
import { Observable, Subscription } from "rxjs";
import { finalize, switchMap, tap } from "rxjs/operators";
import { AddFoodItemModel } from "./add-food.model";
import { FoodService } from "../food.service";
import { IResolvedRouteData, ResolverHelper } from "src/app/utils/resolver-helper";
import { FoodDetailsModel } from "../details/food-details.model";

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

@Component({
    selector: 'app-add-food',
    templateUrl: './add-food.page.html',
    styleUrls: [
      './styles/add-food.page.scss',
      './styles/add-food.shell.scss'
    ]
  })
export class AddFoodPage implements OnInit {

    button_title = "Post";
    back="";
    tags = [];
    title_image :any =
    {
      result:'./assets/sample-images/food/la-olla.jpg',
      file:null
    };
    is_title_image_selected = false;
    is_Submitted = false;
    validationsForm: FormGroup;
    genders: Array<string>;
    category_id = "";
    post_id="";
    additional_pictures: any = [];

    validations = {
        'title': [
          { type: 'required', message: 'Title is required.' },
          { type: 'minlength', message: 'Title must be at least 5 characters long.' },
          { type: 'maxlength', message: 'Title cannot be more than 20 characters long.' },
        ],
        'description': [
          { type: 'required', message: 'Description is required.' }
        ]
      };

    constructor(private route: ActivatedRoute,private foodService: FoodService,private router: Router) { }

    ngOnInit(): void {

      this.category_id = this.route.snapshot.paramMap.get('category_id'); // Add flow
      this.post_id = this.route.snapshot.paramMap.get('post_id'); // Edit Flow

      this.validationsForm = new FormGroup({
        title: new FormControl('', Validators.compose([
          Validators.maxLength(20),
          Validators.minLength(5),
          Validators.required
        ])),
        description: new FormControl('', Validators.required),
      });

      if(this.category_id)
         this.back = "app/categories/food/"+this.category_id;
      else
      {
        // Get Post Data
        this.back = "app/categories/food-detail/"+this.post_id;
        this.button_title = "Post";
        this.foodService.getDetailsDataSource(this.post_id)
        .subscribe((state) => {
          this.validationsForm.get('title').setValue(state.title);
          this.validationsForm.get('description').setValue(state.description);
          this.title_image.result  = state.title_picture;
          this.title_image.file  = null;
          this.is_title_image_selected = true;
          state.additional_pictures.forEach(element => {
            this.additional_pictures.push({result:element,file:null,is_existing:true});
          });
          this.tags  = state.tags;
          this.category_id = state.category_id;

        }, (error) => console.log(error));
      }

      
    }

    onSubmit() {

      this.is_Submitted =true;
      if(this.validate()){
        this.is_Submitted = false;
        var values = this.validationsForm.value;
        var food:any={};
        food.post_id= this.post_id;
        food.category_id = this.category_id;
        food.title = values.title;
        food.description = values.description;
        food.tags = this.tags;
        food.title_picture = this.title_image.file ? {file:this.title_image.file} : "";
        food.additional_pictures = this.additional_pictures;
        this.foodService.saveFood(food).then(res=>{
          if(res.status){
            this.router.navigate(['app/categories/food/'+this.category_id], { replaceUrl: true});
          }
        })
      }
    }

    validate(){

      var is_valid = true;
      if(!this.validationsForm.valid)
          is_valid = false;
      else if(!this.is_title_image_selected)
          is_valid = false;
      else if(this.additional_pictures.length<=0)
          is_valid=false;

      return is_valid;
    }

    uploadAdditionalImage(event: FileList){

      const file = event.item(0)

      // Image validation
      if (file.type.split('/')[0] !== 'image') { 
        console.log('File type is not supported!');
        return;
      }

      var reader = new FileReader();
      reader.readAsDataURL(file); 
      reader.onload = (_event) => { 
        this.additional_pictures.push({
          result:reader.result,
          file:file,
          is_existing:false
        }); 
      }

    }

    uploadImage(event: FileList) {
      
      const file = event.item(0);
      this.is_title_image_selected = false;

      // Image validation
      if (file.type.split('/')[0] !== 'image') { 
        console.log('File type is not supported!');
        return;
      }

      this.is_title_image_selected = true;

      var reader = new FileReader();
      reader.readAsDataURL(file); 
      reader.onload = (_event) => { 
        this.title_image = {
          result:reader.result,
          file:file
        }; 
      }
    }

  

  // ionViewWillLeave(): void {
    
  // }

  addTags(event) {
  
    var tag = event.target.value;
    if(this.tags.indexOf(tag)<0)
       this.tags.push(tag);

    event.target.value="";
  }

    
}