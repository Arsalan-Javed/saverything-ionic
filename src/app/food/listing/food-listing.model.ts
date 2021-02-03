import { ShellModel } from '../../shell/data-store';

export class FoodItemModel {
  // icon: string;
  // name: string;
  // address: string;
  // priceRange: number;
  // rating: number;
  post_id:string;
  title_picture: string;
  tags: Array<string> = [];
  category_id:string;
  description:string;
  title:string;
  additional_pictures : Array<string> = [];
}

export class FoodListingModel extends ShellModel {
  items: Array<FoodItemModel> = [];

  constructor() {
    super();
  }
}
