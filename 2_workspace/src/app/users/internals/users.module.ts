import { Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { UsersDao } from './data/UsersDao';
import { UsersService } from './domain/UsersService';
import { UserAddPage } from './view/pages/user-add/user-add.page';
import { UserUpdatePage } from './view/pages/user-update/user-update.page';
import { UserFormComponent } from './view/components/user-form/user-form.component';
import { commonsNames, IAuthApiRoutes } from '../../0common';
import { MaterialModule } from '../../0common/material.module';
import { MaterialForms } from '../../0common/MaterialForms.module';
import { UsersFileDao } from './data/UsersFileDao';
import { MatExpansionModule } from '@angular/material/expansion';
import { UsersListPage2 } from './view/pages/user-list/users-list.page2';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


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
    MatSlideToggleModule,
  ],
})
export class UsersModule {

  constructor(
    @Inject(commonsNames.IAuthApiRoutes) jwtInter: IAuthApiRoutes
  ) {
    const routes = Array.from(UsersDao.endPoints.values());
    jwtInter.addRoutes(routes);
  }

}
