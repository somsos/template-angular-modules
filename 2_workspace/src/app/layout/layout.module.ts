import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MainLayoutPage } from "./view/pages/main-layout/main-layout.page";
import { LayoutService } from "./domain/LayoutService";
import { HeaderComponent } from "./view/components/header/header.component";
import { RouterModule, RouterOutlet } from "@angular/router";
import { DialogConfirmationComponent } from "./view/components/dialog-confirmation/dialog-confirmation.component";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { commonsNames } from "../0common";
import { MaterialModule } from "../0common/material.module";

@NgModule({
  declarations: [
    MainLayoutPage,
    HeaderComponent,
    DialogConfirmationComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatToolbarModule,
    MaterialModule,
    RouterModule,
    RouterOutlet,
  ],
  providers: [
    { provide: commonsNames.ILayoutService, useClass: LayoutService },
  ]
})
export class LayoutModule {}

