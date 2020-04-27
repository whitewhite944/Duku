function Rack() {

}

Rack.prototype.run = function () {
    var self = this;
    self.listenGetApiIdc();
    self.listenCreateModal();
    self.listenCreateRack();
    self.listenDeleteRack();
    self.listenEditModal();
    self.listenEditRack();
    self.listenSearchRack();
};

Rack.prototype.listenCreateModal = function () {
    var self = this;
    var addIdc = $('#add');
    var createModal = $('#create_modal');
    addIdc.click(function () {
        createModal.modal();
    });
};

Rack.prototype.listenCreateRack = function () {
    var self = this;
    var submitBtn = $("#create_btn");
    submitBtn.click(function () {
        var idcidInput = $('#create_idc_id option:selected');
        var racknameInput = $("#rack_name");
        var racknumberInput = $("#rack_number");
        var racksizeInput = $("#rack_size");
        var rackremarkInput = $("#rack_remark");
        var idc_id = idcidInput.attr('id');
        var name = racknameInput.val();
        var number = racknumberInput.val();
        var size = racksizeInput.val();
        var remark = rackremarkInput.val();
        data = {idc_id:idc_id, name:name, number:number, size:size, remark:remark};
        dukuajax.post({
            'url': '/cmdb/rack/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    });
};

Rack.prototype.listenDeleteRack = function () {
    var deleteBtn = $('.delete-btn');
    deleteBtn.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var pk = tr.attr('data-id');
        dukuajax.delete({
            'url': '/cmdb/rack/' + pk + '/',
            'data': {},
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    });
};

Rack.prototype.listenEditModal = function () {
    var editRack = $('.edit-btn');
    var editModal = $('#edit_modal');
    editRack.click(function () {
        editModal.modal();
        var self = $(this);
        var tr = self.parent().parent();
        var id = tr.attr('data-id');
        var name = tr.attr('data-name');
        var number = tr.attr('data-number');
        var size = tr.attr('data-size');
        var remark = tr.attr('data-remark');
        var editrackid = $('#edit_rack_id').val(id);
        var editrackname = $('#edit_rack_name').val(name);
        var editracknumber = $('#edit_rack_number').val(number);
        var editracksize = $('#edit_rack_size').val(size);
        var editrackremark = $('#edit_rack_remark').val(remark);
        var idcname = $.trim($(this).parents("tr").children("td").eq(3).text());
        var idclist = $("#modify_idc_id").prop('value',idcname);
    });
};

Rack.prototype.listenEditRack = function () {
    var editIdc = $('.edit-btn');
    var submitBtn = $("#rack-edit-submit");
    submitBtn.click(function (e) {
        e.preventDefault();
        var idcidInput = $('#modify_idc_id option:selected');
        var rackidInput = $("#edit_rack_id");
        var racknameInput = $("#edit_rack_name");
        var racknumberInput = $("#edit_rack_number");
        var racksizeInput = $("#edit_rack_size");
        var rackremarkInput = $("#edit_rack_remark");
        var idc_id = idcidInput.attr('id');
        var pk = rackidInput.val();
        var name = racknameInput.val();
        var number = racknumberInput.val();
        var size = racksizeInput.val();
        var remark = rackremarkInput.val();
        data = {name:name, idc_id:idc_id, number:number, size:size, remark:remark};
        dukuajax.put({
            'url': '/cmdb/rack/' + pk + '/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    });
};

Rack.prototype.listenSearchRack = function () {
    var self = this;
    var submitBtn = $("#search_btn");
    submitBtn.click(function (e) {
        e.preventDefault();
        var valueInput = $('#search_value').val();
        window.location.href = '/cmdb/rack/?search=' + valueInput
    });
};

Rack.prototype.listenGetApiIdc = function () {
    $.ajax({
        type: 'GET',
        url: '/cmdb/api_idcs',
        data: {},
        dataType: 'json',
        success: function (result) {
            data = result.data;
            options = "";
            for (const obj of data) {
                option = '<option id='+obj.id+'>'+obj.name+'</option>';
                options += option;
            }
            $('#create_idc_id').append(options);    
            $('#modify_idc_id').append(options);  
        }
    });
};

$(function () {
    var rack = new Rack();
    rack.run();
});