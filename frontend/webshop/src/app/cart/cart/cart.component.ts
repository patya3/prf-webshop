import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { OrderDetails } from 'src/app/models/order-details.model';
import { Product } from 'src/app/models/product.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  /* MatTable column names. */
  displayColumns = ['position', 'name', 'price', 'actions'];

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(
    public cartService: CartService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  /* Remove item from cart and update table. */
  removeFromCart(product: Product): void {
    this.cartService.removeFromCart(product);
    this.table.renderRows();
  }

  emptyCart(): void {
    this.cartService.emptyCart();
  }

  /* Place order. Call java spring backend and save the order (with the items) to the database. */
  placeOrder(): void {
    const cartProducts: Product[] = this.cartService.getCart();
    const uid: string = JSON.parse(localStorage.getItem('user')).id;
    const orderDetails: OrderDetails = {
      totalPrice: 0,
      date: new Date(),
      userId: uid,
      products: [],
    };
    for (const p of cartProducts) {
      orderDetails.totalPrice += p.price;
      orderDetails.products.push({
        id: p._id,
        name: p.name,
        price: p.price,
      });
    }
    this.cartService.placeOrder(orderDetails).subscribe((res) => {
      if (res.successfull) {
        this.snackBar.open(res.msg, 'Cancel', { duration: 3000 });
        this.cartService.emptyCart();
        this.router.navigateByUrl('/products/list');
      } else {
        this.snackBar.open(res.error, 'Cancel', { duration: 3000 });
      }
    });
  }
}
