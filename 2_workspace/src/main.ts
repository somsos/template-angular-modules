import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CommonsModule } from './app/0common/commons.module';

platformBrowserDynamic().bootstrapModule(CommonsModule)
  .catch(err => console.error(err));
