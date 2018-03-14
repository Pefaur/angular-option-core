import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptAuthService } from './common/auth.service';

import { API_URL } from './common/api-url.config';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class OptionCoreModule {
  static forRoot(apiUrl: string): ModuleWithProviders {
    return {
      ngModule: OptionCoreModule,
      providers: [OptAuthService, {provide: API_URL, useValue: apiUrl}]
    };
  }
}
