import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
export declare abstract class OptFormComponent implements OnInit {
    protected formBuilder: FormBuilder;
    form: FormGroup;
    submitted: boolean;
    serverMessage: {
        message: string;
        show: boolean;
        isStatusOk: boolean;
    };
    SERVER_MESSAGES: any;
    /**
     *
     * @example {
     *   field1: '',
     *   field2: ''
     * }
     */
    formErrors: any;
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
    VALIDATION_MESSAGES: any;
    /**
     * @example {
     *   field1: 'Field 1',
     *   field2: 'Field 2'
     * }
     */
    PLACEHOLDERS: any;
    SUBMIT_LABEL: string;
    formBuilderGroupControlsConfig: any;
    formBuilderGroupExtra?: any;
    abstract submit(): void;
    constructor(formBuilder: FormBuilder);
    ngOnInit(): void;
    isFromValid(): boolean;
    onSubmit(): void;
    buildForm(): void;
    onValueChanged(data?: any): void;
}
