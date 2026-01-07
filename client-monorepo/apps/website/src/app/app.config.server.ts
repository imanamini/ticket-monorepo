import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { InMemoryStorage } from '@digipay/ng-storage';

const serverConfig: ApplicationConfig = {
  providers: [
    {
      provide: 'STORAGE_KEY',
      useValue: '__dg_website',
    },
    {
      provide: 'StorageInterface',
      useClass: InMemoryStorage,
    },
    {
      provide: 'InMemoryStorageService',
      useClass: InMemoryStorage,
    },
    provideServerRendering(),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
