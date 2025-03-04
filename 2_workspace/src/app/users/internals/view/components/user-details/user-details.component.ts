import { Component, Input, OnInit, signal } from '@angular/core';
import { IUserDto } from '../../../commons/IUserDto';

@Component({
  selector: 'user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {

  @Input()
  u!: IUserDto;

  @Input()
  show: boolean = false;

  rolesList!: string;

  ngOnInit(): void {
    this._generateRolesList();
  }

  private _generateRolesList() {
    let list = "";
    if(this.u.roles.length == 0) {
      this.rolesList = "Ninguno";
      return ;
    }
    for (let i = 0; i < this.u.roles.length; i++) {
      const isLastAuth = i == (this.u.roles.length - 1);
      if(!isLastAuth) {
        list = list + this.u.roles[i].authority + ", "
      } {
        list = list + this.u.roles[i].authority
      }
    }
    this.rolesList = list;
  }

  showDate(d: Date | undefined): string {
    if(!d) {
      return "Sin registro"
    }
    return d.getFullYear() + "/" +
      d.getMonth() + "/"  +
      d.getDay();
  }

}
