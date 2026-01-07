export interface NavigationCategoriesModel {
  title: string;
  width: string;
  subCategories: NavigationSubCategoriesModel[];
}

export interface NavigationSubCategoriesModel {
  title: string;
  description: string;
  icon: string;
  url: string;
  width: string;
}
