import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from '../internals/users-routing.module';
import { UsersDao } from '../internals/data/UsersDao';
import { UsersService } from '../internals/domain/UsersService';
import { UserAddPage } from '../internals/view/pages/user-add/user-add.page';
import { UserUpdatePage } from '../internals/view/pages/user-update/user-update.page';
import { UserFormComponent } from '../internals/view/components/user-form/user-form.component';
import { commonsNames, IAuthBackendService } from '../../0common';
import { MaterialModule } from '../../0common/material.module';
import { MaterialForms } from '../../0common/MaterialForms.module';
import { UsersFileDao } from '../internals/data/UsersFileDao';
import { MatExpansionModule } from '@angular/material/expansion';
import { UsersListPage2 } from '../internals/view/pages/user-list/users-list.page2';


@NgModule({
  providers: [
    UsersFileDao,
    UsersDao,
    UsersService,
  ],
  declarations: [
    UserFormComponent,
    UserAddPage,
    UserUpdatePage,
    UsersListPage2,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    MaterialForms,
    MatExpansionModule,
  ],
})
export class UsersModule {

  constructor(
    @Inject(commonsNames.IAuthBackendService) jwtInter: IAuthBackendService
  ) {
    const routes = Array.from(UsersDao.endPoints.values());
    jwtInter.addRoutes(routes);
  }

}
