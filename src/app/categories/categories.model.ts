import { ShellModel } from "../shell/data-store";

export class CategoryItemModel {
  name: string;
  title: string;
  size: string;
  ratio:any;
  class:string;
  src:string;
  order:number;
  id:number;
}

export class CategoriesModel extends ShellModel {
  items: Array<CategoryItemModel> = [];

  constructor() {
    super();
  }
}
