import { Inject, Injectable } from '@angular/core';
import { MODULE_CONFIG } from '../option-core.config';
var OptLazyScriptService = (function () {
    function OptLazyScriptService(config) {
        var _this = this;
        this.config = config;
        this.scripts = {};
        config.lazyScriptsStore.forEach(function (script) {
            _this.scripts[script.name] = {
                loaded: false,
                src: script.src
            };
        });
    }
    OptLazyScriptService.prototype.load = function () {
        var _this = this;
        var scripts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            scripts[_i] = arguments[_i];
        }
        var promises = [];
        scripts.forEach(function (script) { return promises.push(_this.loadScript(script)); });
        return Promise.all(promises);
    };
    OptLazyScriptService.prototype.loadScript = function (name) {
        var _this = this;
        if (this.scripts[name].promise) {
            return this.scripts[name].promise;
        }
        return this.scripts[name].promise = new Promise(function (resolve, reject) {
            // resolve if already loaded
            if (_this.scripts[name].loaded) {
                resolve({ script: name, loaded: true, status: 'Already Loaded' });
            }
            else {
                // load script
                var script_1 = document.createElement('script');
                script_1.type = 'text/javascript';
                script_1.src = _this.scripts[name].src;
                if (script_1.readyState) {
                    script_1.onreadystatechange = function () {
                        if (script_1.readyState === 'loaded' || script_1.readyState === 'complete') {
                            script_1.onreadystatechange = null;
                            _this.scripts[name].loaded = true;
                            resolve({ script: name, loaded: true, status: 'Loaded' });
                        }
                    };
                }
                else {
                    script_1.onload = function () {
                        _this.scripts[name].loaded = true;
                        resolve({ script: name, loaded: true, status: 'Loaded' });
                    };
                }
                script_1.onerror = function (error) { return resolve({ script: name, loaded: false, status: 'Loaded' }); };
                document.getElementsByTagName('head')[0].appendChild(script_1);
            }
        });
    };
    OptLazyScriptService.prototype.isLoadedScript = function (name) {
        return !!this.scripts[name].loaded;
    };
    return OptLazyScriptService;
}());
export { OptLazyScriptService };
OptLazyScriptService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
OptLazyScriptService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [MODULE_CONFIG,] },] },
]; };
//# sourceMappingURL=lazy-script.service.js.map