import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAddPage } from './view/pages/user-add/user-add.page';
import { UserDetailsPage } from './view/pages/user-details/user-details.page';
import { UserUpdatePage } from './view/pages/user-update/user-update.page';
import { UsersListPage } from './view/pages/users-list/users-list.page';

const routes: Routes = [
  { path: '', component: UsersListPage, },
  { path: 'details', component: UserDetailsPage, },
  { path: 'add', component: UserAddPage, },
  { path: 'update', component: UserUpdatePage, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
