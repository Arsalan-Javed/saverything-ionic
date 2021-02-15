import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import { CategoriesModel } from '../../categories/categories.model';
import { IResolvedRouteData, ResolverHelper } from  '../../utils/resolver-helper';
import { PostService } from "../post.service";
import { ItemReorderEventDetail } from '@ionic/core';
import { AlertController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
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

    video_url = "https://www.youtube.com/embed/3gAssJ5cXi8";
    button_title = "Post";
    back="";
    tags = [];
    categoriesList: any;
    action="";
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
    other_pictures: any = [];
    subscriptions: Subscription;
    DefaultFields =['title','description','category_id','tags'];
    AddFields = ['category_id'];
    Sizes = ['small','medium','large'];
    itemsOrder = [
      {
        name:'title',
        title:'Title',
        type:'text',
        value:null,
        is_existing:true,
      },
      {
        name:'description',
        title:'Description',
        type:'textarea',
        value:null,
        is_existing:true,
      },
      {
        name:'category_id',
        title:'Category',
        type:'category',
        value:null,
        is_existing:true,
      },
      {
        name:'tags',
        title:'Tags',
        type:'tags',
        value:null,
        is_existing:true,
      },
    ];
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

    constructor(private route: ActivatedRoute,
      private postService: PostService,
      private router: Router,
      private fb : FormBuilder,
      public alertController: AlertController,
      private dom : DomSanitizer
      ) { }

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
        tags: new FormControl('')
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
          // reOrder this elements
          this.reOrder(state.order);

        }, (error) => console.log(error));
      }
      else if(this.category_id)
      {
        this.back = "app/categories/posts/"+this.category_id;
        this.validationsForm.get('category_id').setValue(this.category_id);
      }
    }

    reOrder(order)
    {
      
      this.itemsOrder = order;
      this.itemsOrder.forEach(element => {
        element.is_existing=true;
      });
      var controls = this.validationsForm.controls;
      order.forEach(element => {
        var control = controls[element.name];
        if(control)
          this.validationsForm.addControl(element.name,control);
        else
          this.validationsForm.addControl(element.name,new FormControl(element.value));
        
      });
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
        this.prepareValues();
        post.order = this.itemsOrder;
        this.postService.savePost(post).then(res=>{
          if(res.status){
            if(!this.back)
            {
              if(!this.category_id)
                this.back = 'app/categories/posts/'+values.category_id;
             else
                this.back ='app/categories/posts/'+this.category_id;
            }
            this.onBack();
          }
        })
      }
    }

    prepareValues(){

      this.itemsOrder.forEach(element => {
        if(this.DefaultFields.indexOf(element.name)<0)
        {
          element.value = this.validationsForm.controls[element.name].value;
        }
      });
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

    // getAdditionalData(){
    //   var additional_data =[];
    //   this.itemsOrder.forEach(element => {
    //     if(this.DefaultFields.indexOf(element.name)<0){
    //       var add = {
    //         name:element.name,
    //         title:element.title,
    //         type:element.type,
    //         value: element['value'],
    //         is_existing:element.is_existing
    //       }
    //       if(add.type=='img'){
    //         add['file'] = element['file'];
    //       }
             
    //       delete element['file'];
    //       additional_data.push(add);
    //     }
    //   });
    //   return additional_data;
    // }

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

  doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    let draggedItem = this.itemsOrder.splice(ev.detail.from,1)[0];
    this.itemsOrder.splice(ev.detail.to,0,draggedItem)

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }

  getUniqName(inital)
  {
    var number_= Math.floor((Math.random() * 100) - 1);
    var name = inital + number_;
    if(this.itemsOrder.filter(p=>p.name==name).length>0)
       return this.getUniqName(inital);
    else
       return name;
  }

  addControl(value){

    if(value){
      if(this.action=='text'){
        var name = this.getUniqName('text_');
        this.validationsForm.addControl(name,new FormControl(value));
        this.itemsOrder.push({
          name:name,
          title:'',
          type:'text',
          value:value,
          is_existing:false,
        });
      }
      else{
        var url_ = 'https://www.youtube.com/embed/'+value;
        var name = this.getUniqName('url_');
        this.validationsForm.addControl(name,new FormControl(url_));
        this.itemsOrder.push({
          name:name,
          title:'',
          type:'url',
          value:url_,
          is_existing:false,
        });
      }
    }
    
  }

  addField(type)
  {
    this.action = type;
    this.presentAlertPrompt();
  }

  choseImage(event: FileList) {
      
    const file = event.item(0);

    // Image validation
    if (file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!');
      return;
    }

    var name = this.getUniqName('img_');
    var reader = new FileReader();
    reader.readAsDataURL(file); 
    reader.onload = (_event) => { 
      this.validationsForm.addControl(name,new FormControl(reader.result));
      var obj = {name:name,title:'',type:'img',value:reader.result,file:file,is_existing:false}
      this.itemsOrder.push(obj); 
    }
  }


  async presentAlertPrompt() {

    var inputs =  [];
    if(this.action=='text')
    {
      inputs.push({name: 'input_field',
      type: 'text',
      placeholder: 'Enter some thing'
     });
    }
    else{
      inputs.push({name: 'input_field',
       type: 'url',
       placeholder: 'Enter Youtube Video Id'
      });
    }

    const alert = await this.alertController.create({
     // cssClass: 'forms-validations-content',
      // header: 'Text',
      inputs: inputs,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'OK',
          handler: (event) => {
            this.addControl(event['input_field']);
          }
        }
      ]
    });

    await alert.present();
  }

  async addCategoryPrompt() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Add Category',
      inputs: [
        {
          name: 'input_category',
          label:'Category Name',
          type: 'text',
          placeholder: 'Enter category name'
        },{
          name: 'input_size',
          label:'Category Size',
          type: 'text',
          placeholder: 'small,medium or large'
        },],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Add',
          handler: (event) => {

            this.addCategory({
              name: event['input_category'],
              size: event['input_size']
            });
          }
        }
      ]
    });

    await alert.present();
  }

  addCategory(cat){

    if(!cat.name)
        return;

      var category = {
        name:cat.name.replaceAll(' ','-'),
        order: this.categoriesList.length+1,
        size: cat.size && this.Sizes.indexOf(cat.size.toLowerCase())>=0 ? cat.size.toLowerCase() : 'small',
        title:cat.name
      }

      var $this = this;
      this.postService.addCategory(category).then(function(res){
          if(res.status){
            category['id']= res.category_id;
            $this.categoriesList.push(category);
          }
      });
  }

  optionAdd(name){

    if(name=="category_id")
    {
      this.addCategoryPrompt();
    }

  }

  optionRemove(item){
    if(item.type=='img'){
      //Remove Image First from Storage

      this.postService.removeImage(item.value);
      this.validationsForm.removeControl(item.name);
      this.itemsOrder = this.itemsOrder.filter(p=>p.name!=item.name);
    }
    else{
      this.validationsForm.removeControl(item.name);
      this.itemsOrder = this.itemsOrder.filter(p=>p.name!=item.name);
    }
  }
    
  sanitizer(video){
    return this.dom.bypassSecurityTrustResourceUrl(video);
  }
  
  
  onBack()
  {
    this.router.navigate([this.back], {  replaceUrl: true});
  }
}