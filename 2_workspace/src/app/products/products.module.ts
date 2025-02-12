import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsListPage } from './view/pages/products-list/products-list.page';
import { ProductDetailsPage } from './view/pages/product-details/product-details.page';
import { ProductsService } from './domain/ProductsStateService';
import { ProductsRoutingModule } from './products.routes';
import { ProductsFormComponent } from './view/components/products-form/products-form.component';
import { ProductAddPage } from './view/pages/product-form/product-add.page';
import { ProductUpdatePage } from './view/pages/product-update/product-update.page';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductsFormComponent,
    ProductsListPage,
    ProductDetailsPage,
    ProductAddPage,
    ProductUpdatePage,
  ],
  providers: [ProductsService],
  imports: [CommonModule, ProductsRoutingModule, ReactiveFormsModule],
  exports: [RouterModule],
})
export class ProductsModule {}
