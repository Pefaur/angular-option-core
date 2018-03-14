import { InjectionToken } from '@angular/core';
import { OptScript } from './lazy-script/script';

export interface OptionCoreConfig {
  apiUrl: string;
  lazyScriptsStore: OptScript[];
}

export let MODULE_CONFIG = new InjectionToken<OptionCoreConfig>('module.config');

// Example
// export const API_URL: string = 'http://api.backend.com';
// export const LAZY_SCRIPT_STORE: OptScript[] = [
//   {
//     name: 'slimscroll',
//     src: '../../../assets/plugins/slimscroll/jquery.slimscroll.js'
//   },
//   {
//     name: 'colorpicker',
//     src: '../../../assets/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js'
//   }
// ];
//  export const MODULE_CONFIG = {
//    apiUrl: API_URL,
//    lazyScriptsStore: LAZY_SCRIPT_STORE
//  };
