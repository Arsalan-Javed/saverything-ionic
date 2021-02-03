import { ShellModel } from '../../shell/data-store';

export class AddFoodItemModel {
  additional_pictures: any =[]
  category_id: string;
  description: string;
  tags: any=[];
  title: string;
  title_picture: string;
}

export class AddFoodModel extends ShellModel {
  items: Array<AddFoodItemModel> = [];

  constructor() {
    super();
  }
}
