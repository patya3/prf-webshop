import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from '../products.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  product: Product;

  constructor(
    private activatedRoute: ActivatedRoute,
    private prodService: ProductsService,
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.prodService.getProduct(id).subscribe(
      (res) => {
        if (res.status === 200) {
          this.product = res.body;
        }
      },
      (error) => {
        this.snackBar.open(error.error.error, 'Cancel', { duration: 3000 });
        this.router.navigateByUrl('/products/list');
      }
    );
  }

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
