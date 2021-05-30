import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  /* Get a page of the products from nodejs backend. */
  getProducts(page: number): Observable<any> {
    return this.http.get(environment.serverUrl + 'shop/products', {
      withCredentials: true,
      responseType: 'json',
      observe: 'response',
      params: {
        limit: '6',
        page: page.toString(),
      },
    });
  }

  /* Get a product by id. */
  getProduct(id: string): Observable<any> {
    return this.http.get(environment.serverUrl + `shop/products/${id}`, {
      withCredentials: true,
      responseType: 'json',
      observe: 'response',
    });
  }

  /* -------------- Unused -------------- */

  /* Add product to database. */
  addProduct(product: Product): Observable<any> {
    return this.http.post(environment.serverUrl + `shop/products`, product, {
      withCredentials: true,
      responseType: 'json',
      observe: 'response',
    });
  }

  /* Delete a product from database. */
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(environment.serverUrl + `shop/products/${id}`, {
      withCredentials: true,
      responseType: 'json',
      observe: 'response',
    });
  }

  /* Edit a product. */
  editProduct(id: string, newValues: Partial<Product>): Observable<any> {
    return this.http.post(
      environment.serverUrl + `shop/products/${id}`,
      newValues,
      { withCredentials: true, responseType: 'json', observe: 'response' }
    );
  }
}
