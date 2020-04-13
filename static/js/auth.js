function Auth() {

}

Auth.prototype.run = function () {
    var self = this;
    self.listenLoginEvent();
    self. listenRegisterEvent();
};

Auth.prototype.listenLoginEvent = function () {
    var self = this;
    submitBtn = $('.submit-btn-login');
    submitBtn.click(function (e) {
        e.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();
        var remember = $('#remember').prop("checked");
        dukuajax.post({
            'url': '/',
            'data': {
                'username': username,
                'password': password,
                'remember': remember?1:0
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    window.location.href = '/cmdb/index/';
                }
            }
        });
    });
};

Auth.prototype.listenRegisterEvent = function () {
    var self = this;
    var submitBtn = $('.submit-btn-register');
    submitBtn.click(function (e) {
        e.preventDefault();
        var username = $('#username').val();
        var email = $('#email').val();
        var password1 = $('#password1').val();
        var password2 = $('#password2').val();
        dukuajax.post({
            'url': '/account/register/',
            'data': {
                'username': username,
                'email': email,
                'password1': password1,
                'password2': password2
            },
            'success': function (result) {
                if (result['code'] === 200) {
                    window.location.href = '/';
                }
            }
        });
    });
};

$(function () {
    var auth = new Auth();
    auth.run();
});



