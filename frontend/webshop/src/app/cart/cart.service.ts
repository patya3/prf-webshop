import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrderDetails } from '../models/order-details.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  products: Product[] = [];
  totalPrice = 0;

  constructor(private http: HttpClient) {
    this.products = this.getCart();
    this.totalPrice = this.products.reduce((a, b) => a + b.price, 0);
  }

  /* Add item to cart and update instance in localStorage. */
  addToCart(product: Product): boolean {
    const productIds = this.products.map((p: Product) => p._id);
    if (!productIds.includes(product._id)) {
      this.products.push(product);
      this.updateCart(this.products);
      this.totalPrice += product.price;
      return true;
    }
    return false;
  }

  /* Remove item from cart and update instance in localStorage. */
  removeFromCart(product: Product): void {
    const index = this.products.indexOf(product);
    if (index > -1) {
      this.products.splice(index, 1);
      this.updateCart(this.products);
      this.totalPrice -= product.price;
    }
  }

  emptyCart(): void {
    this.products = [];
    this.updateCart(this.products);
    this.totalPrice = 0;
  }

  /* Get cart from localStorage. */
  getCart(): Product[] {
    const cart = localStorage.getItem('cart');
    let products: Product[];
    if (cart) {
      products = JSON.parse(localStorage.getItem('cart'));
    } else {
      products = [];
    }
    return products;
  }

  /* Save cart to localStorage. */
  updateCart(products: Product[]): void {
    localStorage.setItem('cart', JSON.stringify(products));
  }

  placeOrder(orderDetails: OrderDetails): Observable<any> {
    const cart: Product[] = JSON.parse(localStorage.getItem('cart'));
    return this.http.post(
      environment.springServerUrl + `orders`,
      orderDetails,
      {
        responseType: 'json',
      }
    );
  }

  /* Get all user related order from java backend. */
  getOrders(userId: string): Observable<OrderDetails[]> {
    return this.http.get<OrderDetails[]>(
      environment.springServerUrl + 'orders',
      {
        responseType: 'json',
        params: {
          user_id: userId,
        },
      }
    );
  }
}
