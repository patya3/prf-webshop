export interface Product {
  _id?: string;
  name: string;
  brand: string;
  type: string;
  price: number;
  imageUrl?: string;
  description: string;
  modificationDate: Date;
}
