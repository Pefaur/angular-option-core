export default {
  entry: 'dist/index.js',
  dest: 'dist/bundles/core.umd.js',
  sourceMap: false,
  format: 'umd',
  moduleName: 'ng.core',
  globals: {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/http': 'ng.http',
    '@angular/router': 'ng.router',
    '@angular/forms': 'ng.forms',
    'rxjs/Observable': 'Rx',
    'rxjs/add/operator/map': 'Rx',
    'rxjs/add/operator/catch': 'Rx',
    'rxjs/add/observable/throw': 'Rx',
    'rxjs/add/observable/of': 'Rx'
  }
}
