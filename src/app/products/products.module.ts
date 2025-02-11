import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsListPage } from './view/pages/products-list/products-list.page';
import { ProductDetailsPage } from './view/pages/product-details/product-details.page';
import { ProductsService } from './domain/ProductsStateService';
import { ProductsRoutingModule } from './products.routes';

@NgModule({
  declarations: [ProductsListPage, ProductDetailsPage],
  providers: [ProductsService],
  imports: [CommonModule, ProductsRoutingModule],
  exports: [RouterModule],
})
export class ProductsModule {}
