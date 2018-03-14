import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptAuthService } from './shared/auth.service';
import { OptLazyScriptService } from './lazy-script/lazy-script.service';
import { MODULE_CONFIG } from './option-core.config';
var OptionCoreModule = (function () {
    function OptionCoreModule() {
    }
    OptionCoreModule.forRoot = function (config) {
        return {
            ngModule: OptionCoreModule,
            providers: [OptAuthService, OptLazyScriptService, { provide: MODULE_CONFIG, useValue: config }]
        };
    };
    return OptionCoreModule;
}());
export { OptionCoreModule };
OptionCoreModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: []
            },] },
];
/** @nocollapse */
OptionCoreModule.ctorParameters = function () { return []; };
//# sourceMappingURL=option-core.module.js.map