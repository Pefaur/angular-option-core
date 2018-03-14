import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// @Component({
//   selector: 'opt-form',
//   templateUrl: './form.component.html'
// })
export abstract class OptFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  serverMessage: ServerMessage = {
    message: 'Server message',
    show: false,
    isStatusOk: true
  };

  protected SERVER_MESSAGES: any = {
    401: 'Unauthorized message',
    403: 'Forbidden message',
    500: 'Server error',
    '*': 'Default error'
  };

  /**
   *
   * @example {
   *   field1: '',
   *   field2: ''
   * }
   */
  formErrors: any = {};

  /**
   * @example {
   *   field1: {
   *     'required': 'Field 1 is required',
   *     'email': 'Invalid email'
   *   },
   *   field2: {
   *     'required': 'Field 2 is required',
   *     'minlength': 'Field 2 must be at least 8 characters long'
   *   }
   * }
   */
  VALIDATION_MESSAGES: any = {};

  /**
   * @example {
   *   field1: 'Field 1',
   *   field2: 'Field 2'
   * }
   */
  PLACEHOLDERS: any = {};

  SUBMIT_LABEL = 'Submit label';

  // attribute for first param function of the https://angular.io/api/forms/FormBuilder#group
  formBuilderGroupControlsConfig: any = {
    field1: [
      null, [Validators.required, Validators.email]
    ],
    field2: [
      null, [Validators.required, Validators.minLength(8)]
    ]
  };

  // attribute for seconds param function of the https://angular.io/api/forms/FormBuilder#group
  formBuilderGroupExtra?: any;

  abstract submit(): void;

  constructor(protected formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildForm();
  }

  isFromValid(): boolean {
    return this.form.valid;
  }

  setServerMessage(statusCode: any, isSuccessMessage: boolean = false) {
    this.serverMessage.message = this.SERVER_MESSAGES[statusCode];
    if (!this.serverMessage.message) {
      this.serverMessage.message = this.SERVER_MESSAGES['*'];
    }
    this.serverMessage.show = true;
    this.serverMessage.isStatusOk = isSuccessMessage;
  }

  onSubmit() {
    const self = this;
    self.submitted = true;
    self.onValueChanged();

    if (self.isFromValid()) {
      this.submit();
    }
  }

  buildForm(): void {
    // Build login form
    this.form = this.formBuilder.group(this.formBuilderGroupControlsConfig, this.formBuilderGroupExtra);
    this.form.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.form) {
      return;
    }
    const form = this.form;

    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control: any = form.get(field);

      if ((control && control.dirty && !control.valid) || (control && this.submitted)) {
        if (!control.errors) {
          continue;
        }
        const messages = this.VALIDATION_MESSAGES[field];
        for (const key in control.errors) {
          if (!control.errors.hasOwnProperty(key)) {
            continue;
          }
          if (this.formErrors[field] === '') {
            this.formErrors[field] = messages[key];
          }
        }
      }
    }
  }
}

export interface ServerMessage {
  message: string;
  show: boolean;
  isStatusOk: boolean;
}
