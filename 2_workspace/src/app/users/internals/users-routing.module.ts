import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAddPage } from './view/pages/user-add/user-add.page';
import { UserUpdatePage } from './view/pages/user-update/user-update.page';
import { UsersListPage2 } from './view/pages/user-list/users-list.page2';

const routes: Routes = [
  { path: '', component: UsersListPage2, },
  { path: 'agregar', component: UserAddPage, },
  { path: 'update/:id', component: UserUpdatePage, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
