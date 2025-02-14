import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from '../internals/users-routing.module';
import { UsersDao } from '../internals/data/UsersDao';
import { UsersService } from '../internals/domain/UsersService';
import { UserAddPage } from '../internals/view/pages/user-add/user-add.page';
import { UserDetailsPage } from '../internals/view/pages/user-details/user-details.page';
import { UserUpdatePage } from '../internals/view/pages/user-update/user-update.page';
import { UsersListPage } from '../internals/view/pages/users-list/users-list.page';
import { UserFormComponent } from '../internals/view/components/user-form/user-form.component';


@NgModule({
  providers: [
    UsersDao,
    UsersService,
  ],
  declarations: [
    UserFormComponent,
    UserAddPage,
    UserDetailsPage,
    UserUpdatePage,
    UsersListPage,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
