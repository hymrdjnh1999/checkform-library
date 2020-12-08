function Validator(options) {
    var selectorRules = {};
    function validate(inputElement, rule) {
        if (inputElement) {
            var rules = selectorRules[rule.selector];
            var errorMessage;
            for (var index = 0; index < rules.length; index++) {
                switch (inputElement.type) {
                    case 'checkbox':
                    case 'radio':
                        errorMessage = rules[index](formElement.querySelector(rule.selector + ":checked"));
                        break;
                    default:
                        errorMessage = rules[index](inputElement.value);
                }
                if (errorMessage) break;
            }
            if (errorMessage) {
                let errorElement = getParent(inputElement, options.formGroup).querySelector(options.errorSelector);
                displayError(errorElement, errorMessage);
            }
            else removeError(inputElement);
            return errorMessage;

        }
    }
    let formElement = document.querySelector(options.form);
    if (formElement) {
        formElement.onsubmit = function (event) {
            var isFormValid = true;
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var errorMessage = validate(inputElement, rule);
                if (!errorMessage) {
                    isFormValid = false;
                }
            });
            if (!isFormValid) {
                event.preventDefault();
            }
            if (typeof options.onSubmit === 'function') {
                let enableInputs = formElement.querySelectorAll('[name]');
                let checkElement = undefined;
                let checkedSelector = '';
                let formValues = Array.from(enableInputs).reduce(function (values, input) {
                    switch (input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            break;
                        case 'checkbox':
                            checkedSelector = input.name;
                            if (input.matches(':checked')) {
                                checkElement = input;
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }
                                values[input.name].push(input.value);
                            }
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                    }
                    return values;
                }, {});
                if (!checkElement) {
                    formValues[checkedSelector] = '';
                }
                options.onSubmit(formValues);
            }
            else {
                formElement.submit();
            }
        }
        var rules = options.rules;

        rules.forEach(function (rule) {
            // lưu lại các rule
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            var inputElements = formElement.querySelectorAll(rule.selector);
            inputElements.forEach(function (inputElement) {
                if (inputElement) {
                    inputElement.onblur = function () {
                        validate(inputElement, rule);
                    }
                    inputElement.oninput = function () {
                        removeError(inputElement);
                    }
                    inputElement.onchange = function () {
                        validate(inputElement, rule);
                    }
                }
            });


        });

    }
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector))
                return element.parentElement;
            element = element.parentElement;
        }
    }
    function displayError(errorElement, errorMessage) {
        errorElement.innerText = errorMessage;
        var parentElement = getParent(errorElement, options.formGroup);
        parentElement.classList.add(options.erorrClass);
    }
    function removeError(inputElement) {
        var parentElement = getParent(inputElement, options.formGroup);
        parentElement.classList.remove(options.erorrClass);
    }
}
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Không để trống trường này';
        }
    }
}
Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    }
}
Validator.minLength = function (selector, minlength, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= minlength ? undefined : message || 'Nhập tối thiểu 6 kí tự';
        }
    }
}
Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}
Validator.onSubmit = function (data) {
    console.log(data);
}