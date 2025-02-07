import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsListPage } from './view/pages/products-list/products-list.page';

const routes: Routes = [
  {
    path: '',
    component: ProductsListPage,
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./view/pages/product-form/product-form.page').then(
        (m) => m.ProductFormPage
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
