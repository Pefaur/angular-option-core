import { InjectionToken } from '@angular/core';
import { OptScript } from './lazy-script/script';
export interface OptionCoreConfig {
    apiUrl: string;
    lazyScriptsStore: OptScript[];
}
export declare let MODULE_CONFIG: InjectionToken<OptionCoreConfig>;
