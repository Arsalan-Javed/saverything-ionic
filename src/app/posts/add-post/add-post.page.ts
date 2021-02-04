import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import { CategoriesModel } from '../../categories/categories.model';
import { IResolvedRouteData, ResolverHelper } from  '../../utils/resolver-helper';
import { PostService } from "../post.service";

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

@Component({
    selector: 'app-add-post',
    templateUrl: './add-post.page.html',
    styleUrls: [
      './styles/add-post.page.scss',
      './styles/add-post.shell.scss'
    ]
  })
export class AddPostPage implements OnInit {

    button_title = "Post";
    back="app/categories";
    tags = [];
    categoriesList: any;
    title_image :any =
    {
      result:'./assets/sample-images/food/la-olla.jpg',
      file:null
    };
    is_title_image_selected = false;
    is_Submitted = false;
    validationsForm: FormGroup;
    category_id = "";
    post_id="";
    additional_pictures: any = [];
    subscriptions: Subscription;
    
    validations = {
        'title': [
          { type: 'required', message: 'Title is required.' },
          { type: 'minlength', message: 'Title must be at least 5 characters long.' },
          { type: 'maxlength', message: 'Title cannot be more than 20 characters long.' },
        ],
        'description': [
          { type: 'required', message: 'Description is required.' },
        ],
        'category_id': [
          { type: 'required', message: 'Category is required.' }
        ]
      };

    constructor(private route: ActivatedRoute,private postService: PostService,private router: Router) { }

    ngOnInit(): void {

      this.subscriptions = this.route.data
    .pipe(
      // Extract data for this page
      switchMap((resolvedRouteData: IResolvedRouteData<CategoriesModel>) => {
        return ResolverHelper.extractData<CategoriesModel>(resolvedRouteData.data, CategoriesModel);
      })
    )
    .subscribe((state) => {
      state.items.sort((a, b) => {
        return a.order - b.order;
      });
      this.categoriesList = state.items;
    }, (error) => console.log(error));

      this.category_id = this.route.snapshot.paramMap.get('category_id');
      this.post_id = this.route.snapshot.paramMap.get('post_id'); // Edit Flow

      this.validationsForm = new FormGroup({
        title: new FormControl('', Validators.compose([
          Validators.maxLength(20),
          Validators.minLength(5),
          Validators.required
        ])),
        description: new FormControl('', Validators.required),
        category_id: new FormControl('', Validators.required),
      });

      if(this.post_id)
      {
        // Get Post Data
        this.back = "app/categories/posts/"+ this.category_id +"/post-detail/"+this.post_id;
        this.button_title = "Post";
        this.postService.getDetailsDataSource(this.post_id)
        .subscribe((state) => {
          this.validationsForm.get('title').setValue(state.title);
          this.validationsForm.get('description').setValue(state.description);
          this.validationsForm.get('category_id').setValue(state.category_id);
          this.title_image.result  = state.title_picture;
          this.title_image.file  = null;
          this.is_title_image_selected = true;
          state.additional_pictures.forEach(element => {
            this.additional_pictures.push({result:element,file:null,is_existing:true});
          });
          this.tags  = state.tags;

        }, (error) => console.log(error));
      }
      else if(this.category_id)
      {
        this.back = "app/categories/posts/"+this.category_id;
        this.validationsForm.get('category_id').setValue(this.category_id);
      }
           

      
    }

    onSubmit() {

      this.is_Submitted =true;
      if(this.validate()){
        this.is_Submitted = false;
        var values = this.validationsForm.value;
        var post:any={};
        post.post_id= this.post_id;
        post.category_id = values.category_id;
        post.title = values.title;
        post.description = values.description;
        post.tags = this.tags;
        post.title_picture = this.title_image.file ? {file:this.title_image.file} : "";
        post.additional_pictures = this.additional_pictures;
        this.postService.savePost(post).then(res=>{
          if(res.status){
            this.router.navigate(['app/categories/posts/'+this.category_id], { replaceUrl: true});
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