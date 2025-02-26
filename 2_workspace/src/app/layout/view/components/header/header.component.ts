import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthDto } from '../../../../0common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  @Input()
  public auth?: AuthDto;

  @Output()
  public readonly logoutClicked = new EventEmitter<void>();

  @Output()
  public readonly openDrawerClicked = new EventEmitter<void>();

  @Output()
  public readonly changeTheme = new EventEmitter<boolean>();

  darkTheme = true;

  @Input()
  sideMenuOpened = false;

  onLogoutClicked() {
    this.logoutClicked.emit();
  }

  onOpenDrawerClicked() {
    this.sideMenuOpened = !this.sideMenuOpened;
    this.openDrawerClicked.emit();
  }

  onChangeTheme() {
    this.darkTheme = !this.darkTheme;
    this.changeTheme.emit(this.darkTheme);
  }

}
