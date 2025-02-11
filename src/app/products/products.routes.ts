import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListPage } from './view/pages/products-list/products-list.page';
import { ProductFormPage } from './view/pages/product-form/product-form.page';
import { ProductDetailsPage } from './view/pages/product-details/product-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsListPage,
  },
  {
    path: 'add',
    component: ProductFormPage,
  },
  {
    path: 'details/:id',
    component: ProductDetailsPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
