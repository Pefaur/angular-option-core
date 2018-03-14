import { Validators } from '@angular/forms';
// @Component({
//   selector: 'opt-form',
//   templateUrl: './form.component.html'
// })
var OptFormComponent = (function () {
    function OptFormComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.submitted = false;
        this.serverMessage = {
            message: 'Server message',
            show: false,
            isStatusOk: true
        };
        this.SERVER_MESSAGES = {
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
        this.formErrors = {};
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
        this.VALIDATION_MESSAGES = {};
        /**
         * @example {
         *   field1: 'Field 1',
         *   field2: 'Field 2'
         * }
         */
        this.PLACEHOLDERS = {};
        this.SUBMIT_LABEL = 'Submit label';
        // attribute for first param function of the https://angular.io/api/forms/FormBuilder#group
        this.formBuilderGroupControlsConfig = {
            field1: [
                null, [Validators.required, Validators.email]
            ],
            field2: [
                null, [Validators.required, Validators.minLength(8)]
            ]
        };
    }
    OptFormComponent.prototype.ngOnInit = function () {
        this.buildForm();
    };
    OptFormComponent.prototype.isFromValid = function () {
        return this.form.valid;
    };
    OptFormComponent.prototype.setServerMessage = function (statusCode, isSuccessMessage) {
        if (isSuccessMessage === void 0) { isSuccessMessage = false; }
        this.serverMessage.message = this.SERVER_MESSAGES[statusCode];
        if (!this.serverMessage.message) {
            this.serverMessage.message = this.SERVER_MESSAGES['*'];
        }
        this.serverMessage.show = true;
        this.serverMessage.isStatusOk = isSuccessMessage;
    };
    OptFormComponent.prototype.onSubmit = function () {
        var self = this;
        self.submitted = true;
        self.onValueChanged();
        if (self.isFromValid()) {
            this.submit();
        }
    };
    OptFormComponent.prototype.buildForm = function () {
        var _this = this;
        // Build login form
        this.form = this.formBuilder.group(this.formBuilderGroupControlsConfig, this.formBuilderGroupExtra);
        this.form.valueChanges
            .subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged();
    };
    OptFormComponent.prototype.onValueChanged = function (data) {
        if (!this.form) {
            return;
        }
        var form = this.form;
        for (var field in this.formErrors) {
            if (!this.formErrors.hasOwnProperty(field)) {
                continue;
            }
            // clear previous error message (if any)
            this.formErrors[field] = '';
            var control = form.get(field);
            if ((control && control.dirty && !control.valid) || (control && this.submitted)) {
                if (!control.errors) {
                    continue;
                }
                var messages = this.VALIDATION_MESSAGES[field];
                for (var key in control.errors) {
                    if (!control.errors.hasOwnProperty(key)) {
                        continue;
                    }
                    if (this.formErrors[field] === '') {
                        this.formErrors[field] = messages[key];
                    }
                }
            }
        }
    };
    return OptFormComponent;
}());
export { OptFormComponent };
//# sourceMappingURL=form.component.js.map