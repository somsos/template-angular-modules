import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MainLayoutPage } from './app/main-layout/view/pages/main-layout.page';

bootstrapApplication(MainLayoutPage, appConfig).catch((err) =>
  console.error(err)
);
