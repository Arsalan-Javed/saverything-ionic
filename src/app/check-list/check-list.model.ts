import { ShellModel } from '../../shell/data-store';

export class AddPostItemModel {
  additional_pictures: any =[]
  category_id: string;
  description: string;
  tags: any=[];
  title: string;
  title_picture: string;
}

export class AddPostModel extends ShellModel {
  items: Array<AddPostItemModel> = [];

  constructor() {
    super();
  }
}
