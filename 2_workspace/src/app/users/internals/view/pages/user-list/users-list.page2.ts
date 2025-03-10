import { AfterViewInit, Component, DestroyRef, Inject, inject, ViewChild } from '@angular/core';
import { UsersService } from '../../../domain/UsersService';
import { commonsNames, ILayoutService, PageHelper } from '../../../../../0common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IUserDto } from '../../../commons/IUserDto';
import { UserDtoUtils } from '../../../commons/UserDtoUtils';
import { IUserRoleDto } from '../../../commons/IUserRoleDto';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UsersImagesStore } from '../../../data/mock/UsersImagesStore';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'users-list-page2',
  templateUrl: './users-list.page2.html',
  styleUrl: './users-list.page2.scss'
})
export class UsersListPage2 implements AfterViewInit {
  private readonly _srv = inject(UsersService);
  private readonly destroyRef = inject(DestroyRef);

  textFilter = new FormControl('', [ Validators.pattern("[a-zA-Z0-9]{1,75}") ] );

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  private readonly _formBuilder = inject(FormBuilder);

  readonly columnsToShow = this._formBuilder.group({
    //CAREFUL: sync manually for fist load
    id: true,
    username: true,
    roles: true,
    createdAt: false,
    updatedAt: false,
  });

  public pageHelper!: PageHelper<IUserDto>;

  columnsToDisplay = ["id", 'username', 'roles', 'actions']; //CAREFUL: sync manually for fist load
  expandedElement: IUserDto | null = null;

  constructor(
      @Inject(commonsNames.ILayoutService) private _layoutSrv: ILayoutService
  ) {
    this.pageHelper = new PageHelper(this._srv, this._layoutSrv, 5);
  }

  ngAfterViewInit(): void {
    this.pageHelper.linkUI(this.paginator, this.sort, this.textFilter);
    this._observeColumnsToShow();
  }

  private _observeColumnsToShow() {
    this.columnsToShow.valueChanges
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(columns => {
      const newColumnsToShow:string[] = [];
      if(columns.id === true) { newColumnsToShow.push("id"); }
      if(columns.username === true) { newColumnsToShow.push("username"); }
      if(columns.roles === true) { newColumnsToShow.push("roles"); }
      if(columns.createdAt === true) { newColumnsToShow.push("createdAt"); }
      if(columns.updatedAt === true) { newColumnsToShow.push("updatedAt"); }
      newColumnsToShow.push("actions");
      this.columnsToDisplay = newColumnsToShow;
    })
  }

  /** Checks whether an element is expanded. */
  isExpanded(element: IUserDto) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element: IUserDto) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  showRoles(u: IUserRoleDto[]): string {
    return UserDtoUtils.buildRolesToShow(u).replace(",", ", ")
  }

  getPicture(idUser: number): string {
    if(environment.production) {
      console.warn("No implementado");
      return environment.img404;
    } else {
      return UsersImagesStore.getUrlByUser(idUser);
    }
  }

}
