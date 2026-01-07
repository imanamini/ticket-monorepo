export interface BrandModel {
  id: string;
  title: string;
  englishTitle: string;
  iconPath: string;
  modelDetails: any;
  productCategory: ProductCategory;
}

export interface ProductCategory {
  id: string;
  title: string;
  name: string;
  brands: null;
}
