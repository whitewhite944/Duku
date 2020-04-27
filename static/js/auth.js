function Auth() {

}

Auth.prototype.run = function () {
    var self = this;
    self.listenLoginEvent();
    self.listenRegisterEvent();
    self.listenCreateModal();
    self.listenCreateGroup();
    self.listenDeleteGroup();
    self.listenEditModal();
    self.listenEditGroup();
    self.showInformation();
    self.listenCreateUserModal();
    self.listenEditUserModal();
    self.listenGetApiUser();
    self.listenCreateUser();
    self.listenDeleteUser();
    self.listenEditUser();
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

Auth.prototype.listenCreateModal = function () {
    var addGroup = $('#add');
    var createModal = $('#create_modal');
    addGroup.click(function () {
        createModal.modal();
    });
};

Auth.prototype.listenCreateGroup = function () {
    var self = this;
    var submitBtn = $(".create_btn");
    submitBtn.click(function (e) {
        e.preventDefault();
        var groupnameInput = $("#group_name");
        var name = groupnameInput.val();
        data = {name:name};
        dukuajax.post({
            'url': '/account/group/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    }); 
};

Auth.prototype.listenDeleteGroup = function () {
    var self = this;
    var deleteBtn = $('.delete-btn');
    deleteBtn.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var pk = tr.attr('data-id');
        dukuajax.delete({
            'url': '/account/group/' + pk + '/',
            'data': {},
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    });
};

Auth.prototype.listenEditModal = function () {
    var editIdc = $('.edit-btn');
    var editModal = $('#edit_modal');
    editIdc.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var id = tr.attr('data-id');
        var name = tr.attr('data-name');
        var editidcid = $('#edit_group_id').val(id);
        var editidcname = $('#edit_group_name').val(name);
        editModal.modal();
    });
};

Auth.prototype.listenEditGroup = function () {
    var self = this;
    var submitBtn = $(".group-edit-submit");
    submitBtn.click(function (e) {
        e.preventDefault();
        var idcidInput = $("#edit_group_id");
        var idcnameInput = $("#edit_group_name");
        var pk = idcidInput.val();
        var name = idcnameInput.val();
        data = {name:name};
        dukuajax.put({
            'url': '/account/group/' + pk + '/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    }); 
};

Auth.prototype.showInformation = function () {
    var self = this;
    var showBtn = $('.show-btn');
    informationModal = $('#inforamtion_modal');
    showBtn.click(function (e) {
        e.preventDefault();
        var self = $(this);
        var tr = self.parent().parent();
        var pk = tr.attr('data-id');
        $.ajax({
            type: 'get',
            url: '/account/api_groups/' + pk,
            data: {},
            dataType: "json",
            success: function (result) {
                groupname = result.data.name;
                usernames = result.data.users;
                htmls = '';
                for (let user of usernames) {
                    html = '<li>' + user.username + '</li>';
                    htmls += html;
                }
                $('#show_users').html(htmls);
                $('#show_group_name').attr('value', groupname);
            }
        });
        informationModal.modal();
    });
};

Auth.prototype.listenCreateUserModal = function () {
    var addGroup = $('#add-user');
    var createModal = $('#create_user_modal');
    addGroup.click(function () {
        createModal.modal();
    });
};

Auth.prototype.listenEditUserModal = function () {
    var editIdc = $('.edit-user-btn');
    var editModal = $('#edit_user_modal');
    editIdc.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var id = tr.attr('data-id');
        var name = tr.attr('data-name');
        var role = $.trim($(this).parents("tr").children("td").eq(3).text());
        var superuser = $.trim($(this).parents("tr").children("td").eq(5).text());
        var group = tr.attr('data-group');
        var password = tr.attr('data-password');
        var remark = tr.attr('data-remark');
        var edituserid = $('#edit_user_id').val(id);
        var editusername = $('#edit_user_name').val(name);
        var editpassword = $('#edit_user_password').val(password);
        var editremark = $('#edit_remark').val(remark);
        var editsuperuser = $('#edit_superuser').val(superuser);
        var editgroup = $('#edit_group_name').val(group);
        var editrole = $('#edit_user_role').val(role);
        editModal.modal();
    });
};

Auth.prototype.listenEditUser = function () {
    var editIdc = $('.edit-user-btn');
    var submitBtn = $(".edit-user-submit");
    submitBtn.click(function (e) {
        e.preventDefault();
        var self = $(this);
        var tr = self.parent().parent();
        var useridInput = $('#edit_user_id');
        var groupInput = $('#edit_group_name option:selected');
        var nameInput = $("#edit_user_name");
        var passwordInput = $('#edit_user_password');
        var roleInput = $("#edit_user_role option:selected");
        var superuserInput = $("#edit_superuser option:selected");
        var remarkInput = $("#edit_remark");
        var pk = useridInput.val();
        var group_name = groupInput.val();
        var username = nameInput.val();
        var password = passwordInput.val();
        var role = roleInput.attr('role_id');
        var is_superuser = superuserInput.attr('status_id');
        var remark = remarkInput.val();
        data = {group_name:group_name, username:username, password:password, role:role, is_superuser:is_superuser, remark:remark};
        dukuajax.put({
            'url': '/account/user/' + pk + '/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    });
};

Auth.prototype.listenCreateUser = function () {
    var self = this;
    var submitBtn = $(".create_user_btn");
    submitBtn.click(function () {
        var groupInput = $('#create_group_name option:selected');
        var roleInput = $('#create_user_role option:selected');
        var usernameInput = $("#create_user_name");
        var passwordInput = $("#create_user_password");
        var superuserInput = $("#create_superuser option:selected");
        var remarkInput = $("#create_remark");
        var group_name = groupInput.val();
        var role = roleInput.attr('role_id');
        var username = usernameInput.val();
        var password = passwordInput.val();
        var is_superuser = superuserInput.attr('status_id');
        var remark = remarkInput.val();
        data = {group_name:group_name, role:role, username:username, password:password, is_superuser:is_superuser, remark:remark};
        dukuajax.post({
            'url': '/account/user/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    });
};

Auth.prototype.listenDeleteUser = function () {
    var deleteBtn = $('.delete-user-btn');
    deleteBtn.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var pk = tr.attr('data-id');
        dukuajax.delete({
            'url': '/account/user/' + pk + '/',
            'data': {},
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    });
};

Auth.prototype.listenGetApiUser = function () {
    $.ajax({
        type: 'GET',
        url: '/account/api_groups/',
        data: {},
        dataType: 'json',
        success: function (result) {
            data = result.data;
            options = "";
            for (const obj of data) {
                option = '<option id='+obj.id + '>'+obj.name+'</option>';
                options += option;
            }
            $('#create_group_name').html(options);    
            $('#edit_group_name').html(options);  
        }
    });
};

$(function () {
    var auth = new Auth();
    auth.run();
});



