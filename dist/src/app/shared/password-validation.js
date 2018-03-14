var OptPasswordValidation = (function () {
    function OptPasswordValidation() {
    }
    OptPasswordValidation.MatchPassword = function (AC) {
        var password = AC.get('password').value; // to get value in input tag
        var confirmPassword = AC.get('repeatPassword').value; // to get value in input tag
        if (password !== confirmPassword) {
            AC.get('repeatPassword').setErrors({ MatchPassword: true });
        }
        else {
            return null;
        }
    };
    return OptPasswordValidation;
}());
export { OptPasswordValidation };
//# sourceMappingURL=password-validation.js.map