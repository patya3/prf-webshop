import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../cart/cart.service';
import { OrderDetails } from '../models/order-details.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class OrdersComponent implements OnInit {
  orders: (OrderDetails & { isExpanded: boolean })[];

  displayColumns: string[] = ['date', 'totalPrice', 'actions'];

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    this.cartService.getOrders(user.id).subscribe((res) => {
      if (res) {
        this.orders = res.map((order: OrderDetails) => {
          return { ...order, isExpanded: false };
        });
      } else {
        this.snackBar.open('An error occured', 'Cancel', { duration: 3000 });
      }
    });
  }
}
