import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptAuthService } from './common/auth.service';
import { API_URL } from './common/api-url.config';
var OptionCoreModule = (function () {
    function OptionCoreModule() {
    }
    OptionCoreModule.forRoot = function (apiUrl) {
        return {
            ngModule: OptionCoreModule,
            providers: [OptAuthService, { provide: API_URL, useValue: apiUrl }]
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