import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductComponent } from './product/product.component';
import { ErrorComponent } from '../error/error.component';
const routes: Routes = [
  { path: 'list', component: ProductsListComponent },
  { path: ':id', component: ProductComponent },
  { path: '', redirectTo: '/products/list', pathMatch: 'full' },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
