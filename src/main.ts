import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MainModule } from './app/main/main.config';

platformBrowserDynamic().bootstrapModule(MainModule)
  .catch(err => console.error(err));
