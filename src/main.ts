import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MainLayoutPage } from './app/0common/view/pages/main-layout/main-layout.page';

bootstrapApplication(MainLayoutPage, appConfig).catch((err) =>
  console.error(err)
);
