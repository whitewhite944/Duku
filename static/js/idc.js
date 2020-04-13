function Idc() {

}

Idc.prototype.run = function () {
    var self = this;
    self.listenCreateModal();
    self.listenCreateIdc();
    self.listenDeleteIdc();
    self.listenEditModal();
    self.listenEditIdc();
    self.listenSearchIdc();
};

Idc.prototype.listenCreateModal = function () {
    var addIdc = $('#add');
    var createModal = $('#create_modal');
    addIdc.click(function () {
        createModal.modal();
    });
};

Idc.prototype.listenCreateIdc = function () {
    var self = this;
    var submitBtn = $(".create_btn");
    submitBtn.click(function (e) {
        e.preventDefault();
        var idcnameInput = $("#idc_name");
        var idcaddressInput = $("#idc_address");
        var idcremarkInput = $("#idc_remark");
        var name = idcnameInput.val();
        var address = idcaddressInput.val();
        var remark = idcremarkInput.val();
        data = {name:name, address:address, remark:remark};
        dukuajax.post({
            'url': '/cmdb/idc/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    }); 
};

Idc.prototype.listenDeleteIdc = function () {
    var self = this;
    var deleteBtn = $('.delete-btn');
    deleteBtn.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var pk = tr.attr('data-id');
        dukuajax.delete({
            'url': '/cmdb/idc/' + pk + '/',
            'data': {},
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    });
};

Idc.prototype.listenEditModal = function () {
    var editIdc = $('.edit-btn');
    var editModal = $('#edit_modal');
    editIdc.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var id = tr.attr('data-id');
        var name = tr.attr('data-name');
        var remark = tr.attr('data-remark');
        var address = tr.attr('data-address');
        var editidcid = $('#edit_idc_id').val(id);
        var editidcname = $('#edit_idc_name').val(name);
        var editidcremark = $('#edit_idc_remark').val(remark);
        var editidcaddress = $('#edit_idc_address').val(address);
        editModal.modal();
    });
};



Idc.prototype.listenEditIdc = function () {
    var self = this;
    var submitBtn = $(".idc-edit-submit");
    submitBtn.click(function (e) {
        e.preventDefault();
        var idcidInput = $("#edit_idc_id");
        var idcnameInput = $("#edit_idc_name");
        var idcaddressInput = $("#edit_idc_address");
        var idcremarkInput = $("#edit_idc_remark");
        var pk = idcidInput.val();
        var name = idcnameInput.val();
        var address = idcaddressInput.val();
        var remark = idcremarkInput.val();
        data = {name:name, address:address, remark:remark};
        dukuajax.put({
            'url': '/cmdb/idc/' + pk + '/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    }); 
};

Idc.prototype.listenSearchIdc = function () {
    var self = this;
    var submitBtn = $("#search_btn");
    submitBtn.click(function (e) {
        e.preventDefault();
        var valueInput = $('#search_value').val();
        window.location.href = '/cmdb/idc/?search=' + valueInput
    });
};

$(function () {
    var idc = new Idc();
    idc.run();
});