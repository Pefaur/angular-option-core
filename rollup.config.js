export default {
  entry: 'dist/index.js',
  dest: 'dist/bundles/core.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.core',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': '_angular_common',
    '@angular/http': '_angular_http',
    '@angular/router': '_angular_router',
    '@angular/forms': '_angular_forms',
    'rxjs/Observable': 'Rx',
    'rxjs/ReplaySubject': 'Rx',
    'rxjs/add/operator/map': 'Rx.Observable.prototype',
    'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
    'rxjs/add/observable/fromEvent': 'Rx.Observable',
    'rxjs/add/observable/of': 'Rx.Observable'
  }
}