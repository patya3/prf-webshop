import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products.service';
import { Product } from 'src/app/models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  products: Product[];
  paginationData: any;

  constructor(
    private prodService: ProductsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getProductPage(null);
  }

  /* Get a page of the products. */
  getProductPage(event: PageEvent): void {
    const pageIndex = event ? event.pageIndex + 1 : 1;
    this.prodService.getProducts(pageIndex).subscribe((res) => {
      if (res.status === 200) {
        const { products, ...paginationData } = res.body;
        this.products = products;
        this.paginationData = paginationData;
      } else {
        this.snackBar.open(res.body.error, 'Cancel', { duration: 3000 });
      }
    });
  }
}
