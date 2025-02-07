import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { MainLayoutPage } from './app/0common/layout';

bootstrapApplication(MainLayoutPage, appConfig).catch((err) =>
  console.error(err)
);
