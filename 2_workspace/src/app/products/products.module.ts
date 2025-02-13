import { Inject, inject, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsListPage } from './view/pages/products-list/products-list.page';
import { ProductDetailsPage } from './view/pages/product-details/product-details.page';
import { ProductsService } from './domain/ProductsStateService';
import { ProductsRoutingModule } from './products.routes';
import { ProductsFormComponent } from './view/components/products-form/products-form.component';
import { ProductAddPage } from './view/pages/product-add/product-add.page';
import { ProductUpdatePage } from './view/pages/product-update/product-update.page';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductDao } from './data/ProductDao';
import { commonsNames, IAuthBackendService } from '../0common';

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
export class ProductsModule {

  constructor(
    @Inject(commonsNames.IAuthBackendService) jwtInter: IAuthBackendService
  ) {
    const routes = Array.from(ProductDao.endPoints.values());
    jwtInter.addRoutes(routes);
  }

}
