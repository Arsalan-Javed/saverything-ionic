import { ShellModel } from "../shell/data-store";

export class HomeItemModel {
  public UserCheckLists: any = {};
  public UserReminders: any = [];
  public CategoriesList: any = [];
  public UserPreferences: any = {};
  public PostsList: any = [];

}

export class HomeModel extends ShellModel {
  Item: HomeItemModel = new HomeItemModel();
  constructor() {
    super();
  }
}
