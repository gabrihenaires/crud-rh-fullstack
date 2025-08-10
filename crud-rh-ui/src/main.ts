// Bootstrap standalone (Angular >=15). Usa zone.js e appConfig.

import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

bootstrapApplication(AppComponent, appConfig).catch(console.error);
