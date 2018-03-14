import { AbstractControl } from '@angular/forms';

export class OptPasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    const password = (<any>AC).get('password').value; // to get value in input tag
    const confirmPassword = (<any>AC).get('repeatPassword').value; // to get value in input tag
    if (password !== confirmPassword) {
      (<any>AC).get('repeatPassword').setErrors({MatchPassword: true})
    } else {
      return null
    }
  }
}
