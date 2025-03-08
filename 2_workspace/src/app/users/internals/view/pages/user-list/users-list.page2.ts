import { AfterViewInit, Component, Inject, inject, ViewChild } from '@angular/core';
import { UsersService } from '../../../domain/UsersService';
import { commonsNames, ILayoutService, PageHelper } from '../../../../../0common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IUserDto } from '../../../commons/IUserDto';
import { UserDtoUtils } from '../../../commons/UserDtoUtils';
import { IUserRoleDto } from '../../../commons/IUserRoleDto';
import { FormControl, Validators } from '@angular/forms';
import { UsersImagesStore } from '../../../data/mock/UsersImagesStore';

@Component({
  selector: 'users-list-page2',
  templateUrl: './users-list.page2.html',
  styleUrl: './users-list.page2.scss'
})
export class UsersListPage2 implements AfterViewInit {
  private readonly _srv = inject(UsersService);

  textFilter = new FormControl('', [ Validators.pattern("[a-zA-Z0-9]{1,75}") ] );

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  public pageHelper!: PageHelper<IUserDto>;

  columnsToDisplay = ['username', 'roles'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'actions'];
  expandedElement: IUserDto | null = null;

  constructor(
      @Inject(commonsNames.ILayoutService) private _layoutSrv: ILayoutService
  ) {
    this.pageHelper = new PageHelper(this._srv, this._layoutSrv, 5);
  }

  ngAfterViewInit(): void {
    this.pageHelper.linkUI(this.paginator, this.sort, this.textFilter);
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
    return UsersImagesStore.getUrlByUser(idUser);
  }

}
