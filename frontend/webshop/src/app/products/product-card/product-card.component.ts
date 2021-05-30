import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent implements OnInit {
  @Input() product: Product;

  constructor(
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  addToCart(): void {
    if (!this.cartService.addToCart(this.product)) {
      this.snackBar.open(
        'This product is already in the shopping cart.',
        'Cancel',
        { duration: 3000 }
      );
    } else {
      this.snackBar.open('Succesfully added to cart.', 'Cancel', {
        duration: 3000,
      });
    }
  }
}
