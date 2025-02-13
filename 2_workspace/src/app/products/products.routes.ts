import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListPage } from './view/pages/products-list/products-list.page';
import { ProductAddPage } from './view/pages/product-add/product-add.page';
import { ProductDetailsPage } from './view/pages/product-details/product-details.page';
import { ProductUpdatePage } from './view/pages/product-update/product-update.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsListPage,
  },
  {
    path: 'add',
    component: ProductAddPage,
  },
  {
    path: 'details/:id',
    component: ProductDetailsPage,
  },
  {
    path: 'update/:id',
    component: ProductUpdatePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
