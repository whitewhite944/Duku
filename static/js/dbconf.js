function DBConf() {

}

DBConf.prototype.run = function () {
    var self = this;
    self.listenCreateModal();
    self.listenCreateDBConf();
    self.listenDeleteDBConf();
    self.listenEditModal();
    self.listenEditDBConf();
};

DBConf.prototype.listenCreateModal = function () {
    var self = this;
    var addIdc = $('#add');
    var createModal = $('#create_modal');
    addIdc.click(function () {
        createModal.modal();
    });
};

DBConf.prototype.listenCreateDBConf = function () {
    var self = this;
    var submitBtn = $(".create_btn");
    submitBtn.click(function (e) {
        e.preventDefault();
        var dbconfidInput = $('#create_dbconf_id option:selected');
        var dbconfnameInput = $("#dbconf_name");
        var dbconfaddressInput = $("#dbconf_address");
        var dbconfportInput = $("#dbconf_port");
        var dbconfuserInput = $("#dbconf_user");
        var dbconfpasswordInput = $("#dbconf_password");
        var dbconfremarkInput = $("#dbconf_remark");
        var env = dbconfidInput.attr('status_id');
        var name = dbconfnameInput.val();
        var address = dbconfaddressInput.val();
        var port = dbconfportInput.val();
        var user = dbconfuserInput.val();
        var password = dbconfpasswordInput.val();
        var remark = dbconfremarkInput.val();
        data = {env:env, name:name, address:address, port:port, user:user, password:password, remark:remark};
        console.log(data);
        dukuajax.post({
            'url': '/sqlmng/dbconf/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    }); 
};

DBConf.prototype.listenDeleteDBConf = function () {
    var deleteBtn = $('.delete-btn');
    deleteBtn.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var pk = tr.attr('data-id');
        dukuajax.delete({
            'url': '/sqlmng/dbconf/' + pk + '/',
            'data': {},
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    });
};

DBConf.prototype.listenEditModal = function () {
    var editServer = $('.edit-btn');
    var editModal = $('#edit_modal');
    editServer.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var id = tr.attr('data-id');
        var name = tr.attr('data-name');
        var address = tr.attr('data-address');
        var port = tr.attr('data-port');
        var user = tr.attr('data-user');
        var password = tr.attr('data-password');
        var remark = tr.attr('data-remark');
        var editdbconfid = $('#edit_dbconf_id').val(id);
        var editdbconfname = $('#edit_dbconf_name').val(name);
        var editdbconfaddress = $('#edit_dbconf_address').val(address);
        var editdbconfport = $('#edit_dbconf_port').val(port);
        var editdbconfuser = $('#edit_dbconf_user').val(user);
        var editdbconfpassword = $('#edit_dbconf_password').val(password);
        var editdbconfremark = $('#edit_dbconf_remark').val(remark);
        var dbconfstatus = $.trim($(this).parents("tr").children("td").eq(5).text());
        var dbconflist = $("#modify_dbconf_id").prop('value',dbconfstatus);
        editModal.modal();
    });
};

DBConf.prototype.listenEditDBConf = function () {
    var self = this;
    var submitBtn = $(".dbconf-edit-submit");
    submitBtn.click(function (e) {
        e.preventDefault();
        var dbconfidInput = $("#edit_dbconf_id");
        var dbconfnameInput = $("#edit_dbconf_name");
        var dbconfaddressInput = $("#edit_dbconf_address");
        var dbconfportInput = $("#edit_dbconf_port");
        var dbconfuserInput = $("#edit_dbconf_user");
        var dbconfpasswordInput = $("#edit_dbconf_password");
        var dbconfenvInput = $('#modify_dbconf_id option:selected');
        var dbconfremarkInput = $("#edit_dbconf_remark");
        var pk = dbconfidInput.val();
        var name = dbconfnameInput.val();
        var address = dbconfaddressInput.val();
        var port = dbconfportInput.val();
        var user = dbconfuserInput.val();
        var password = dbconfpasswordInput.val();
        var env = dbconfenvInput.attr('status_id');
        var remark = dbconfremarkInput.val();
        data = {name:name, address:address, port:port, user:user, password:password, env:env, remark:remark};
        dukuajax.put({
            'url': '/sqlmng/dbconf/' + pk + '/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    }); 
};

$(function () {
    var dbconf = new DBConf();
    dbconf.run();
});