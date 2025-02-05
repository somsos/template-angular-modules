import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products.routes';
import { RouterModule } from '@angular/router';
import { ProductsListPage } from './view/pages/products-list/products-list.page';

@NgModule({
  declarations: [ProductsListPage],
  imports: [CommonModule, ProductsRoutingModule],
  exports: [RouterModule],
})
export class ProductsModule {}
