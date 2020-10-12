This library has created for validate form
Look at example below:

<script>
        Validator({
            form: '#form-1',
            errorSelector: '.form-message',
            erorrClass: 'error',
            formGroup: '.form-group',
            rules: [
                Validator.isRequired('#fullname', 'Vui lòng nhập đầy đủ họ tên của bạn'),
                Validator.isRequired('#email', 'Không được để trống email'),
                Validator.isEmail('#email'),
                Validator.isRequired('#password', 'Mật khẩu không được để trống'),
                Validator.minLength('#password', 6, 'Mật khẩu tối thiểu phải có 6 kí tự'),
                Validator.isRequired('#password-comfirmation'),
                Validator.isConfirmed('#password-comfirmation', function () {
                    return document.querySelector('#form-1 #password').value;
                }, 'Mật khẩu nhập lại không chính xác'),
                Validator.isRequired("input[name='gender']"),
                Validator.isRequired("#file"),
                Validator.isRequired('#province', 'Vui lòng chọn tỉnh thành')
            ],
            onSubmit: function (data) {
                console.log(data);
            }
        });
</script>
1. form : your form id
rules : 
1. isRequired(your input id) : request input data to this input
2. isEmail() : request input email
3. minLength: request length of value in put have to >= min
4. isConfirmed() : request re-enter has to the same value
