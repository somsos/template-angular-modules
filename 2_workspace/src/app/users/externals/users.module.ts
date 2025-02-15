import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from '../internals/users-routing.module';
import { UsersDao } from '../internals/data/UsersDao';
import { UsersService } from '../internals/domain/UsersService';
import { UserAddPage } from '../internals/view/pages/user-add/user-add.page';
import { UserDetailsPage } from '../internals/view/pages/user-details/user-details.page';
import { UserUpdatePage } from '../internals/view/pages/user-update/user-update.page';
import { UsersListPage } from '../internals/view/pages/users-list/users-list.page';
import { UserFormComponent } from '../internals/view/components/user-form/user-form.component';
import { InputFileComponent } from '../internals/view/components/input-file/input-file.component';
import { ReactiveFormsModule } from '@angular/forms';
import { commonsNames, IAuthBackendService } from '../../0common';


@NgModule({
  providers: [
    UsersDao,
    UsersService,
  ],
  declarations: [
    InputFileComponent,
    UserFormComponent,
    UserAddPage,
    UserDetailsPage,
    UserUpdatePage,
    UsersListPage,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    ReactiveFormsModule,
  ]
})
export class UsersModule {

  constructor(
    @Inject(commonsNames.IAuthBackendService) jwtInter: IAuthBackendService
  ) {
    const routes = Array.from(UsersDao.endPoints.values());
    jwtInter.addRoutes(routes);
  }

}
