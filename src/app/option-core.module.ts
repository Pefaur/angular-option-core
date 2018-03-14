import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OptAuthService } from './shared/auth.service';
import { OptLazyScriptService } from './lazy-script/lazy-script.service';

import { OptionCoreConfig, MODULE_CONFIG } from './option-core.config';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class OptionCoreModule {
  static forRoot(config: OptionCoreConfig): ModuleWithProviders {
    return {
      ngModule: OptionCoreModule,
      providers: [OptAuthService, OptLazyScriptService, {provide: MODULE_CONFIG, useValue: config}]
    };
  }
}
