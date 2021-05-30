export interface OrderDetails {
  totalPrice: number;
  date: Date;
  userId: string;
  products: {
    id: string;
    name: string;
    price: number;
  }[];
}
