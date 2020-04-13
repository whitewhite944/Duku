function Server() {

}

Server.prototype.run = function () {
    var self = this;
    self.listenCreateModal();
    self.listenCreateServer();
    self.listenDeleteServer();
    self.listenEditModal();
    self.listenEditServer();
    self.listenGetApiRack();
    self.listenSearchServer();
    self.showInformation();
};

Server.prototype.listenCreateModal = function () {
    var self = this;
    var addIdc = $('#add');
    var createModal = $('#create_modal');
    addIdc.click(function () {
        createModal.modal();
    });    
};

Server.prototype.listenCreateServer = function () {
    var self = this;
    var submitBtn = $("#create_btn");
    submitBtn.click(function (e) {
        e.preventDefault();
        var rackidInput = $('#create_rack_id option:selected');
        var servernameInput = $("#create_name");
        var servercpuInput = $("#create_cpu");
        var servermemoryInput = $("#create_memory");
        var serverdiskInput = $("#create_disk");
        var serveripInput = $("#create_ip");
        var serveruuidInput = $("#create_uuid");
        var serverbusinessInput = $("#create_business");
        var serverstatusInput = $('#create_server_status option:selected');
        var serverremarklineInput = $("#create_remark");
        var rack_id = rackidInput.attr('id');
        var name = servernameInput.val();
        var cpu = servercpuInput.val();
        var memory = servermemoryInput.val();
        var disk = serverdiskInput.val();
        var ip = serveripInput.val();
        var uuid = serveruuidInput.val();
        var business = serverbusinessInput.val();
        var status = serverstatusInput.attr('status_id');
        var remark = serverremarklineInput.val();
        data = {rack_id:rack_id, name:name, cpu:cpu, memory:memory, disk:disk, ip:ip, uuid:uuid, business:business, status:status, remark:remark};
        dukuajax.post({
            'url': '/cmdb/server/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });    
    });

};

Server.prototype.listenDeleteServer = function () {
    var deleteBtn = $('.delete-btn');
    deleteBtn.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var pk = tr.attr('data-id');
        dukuajax.delete({
            'url': '/cmdb/server/' + pk + '/',
            'data': {},
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    });
};

Server.prototype.listenEditModal = function () {
    var editServer = $('.edit-btn');
    var editModal = $('#edit_modal');
    editServer.click(function () {
        var self = $(this);
        var tr = self.parent().parent();
        var id = tr.attr('data-id');
        var name = tr.attr('data-name');
        var cpu = tr.attr('data-cpu');
        var memory = tr.attr('data-memory');
        var disk = tr.attr('data-disk');
        var ip = tr.attr('data-ip');
        var uuid = tr.attr('data-uuid');
        var business = tr.attr('data-business');
        var status = tr.attr('data-status');
        var remark = tr.attr('data-remark');
        var editserverid = $('#edit_server_id').val(id);
        var editservername = $('#edit_server_name').val(name);
        var editservercpu = $('#edit_server_cpu').val(cpu);
        var editservermemory = $('#edit_server_memory').val(memory);
        var editserverdisk = $('#edit_server_disk').val(disk);
        var editserverip = $('#edit_server_ip').val(ip);
        var editserveruuid = $('#edit_server_uuid').val(uuid);
        var editserverbusiness = $('#edit_server_business').val(business);
        var editserverremark = $('#edit_server_remark').val(remark);
        var rackname = $.trim($(this).parents("tr").children("td").eq(2).text());
        var serverstatus = $.trim($(this).parents("tr").children("td").eq(5).text());
        var racklist = $("#modify_rack_id").prop('value',rackname);
        var serverlist = $("#modify_server_status").prop('value',serverstatus);
        console.log(serverstatus);
        editModal.modal();
    });
};

Server.prototype.listenEditServer = function () {
    var self = this;
    var submitBtn = $("#server-edit-submit");
    submitBtn.click(function (e) {
        e.preventDefault();
        var rackidInput = $('#modify_rack_id option:selected');
        var serveridInput = $("#edit_server_id");
        var servernameInput = $("#edit_server_name");
        var servercpuInput = $("#edit_server_cpu");
        var servermemoryInput = $("#edit_server_memory");
        var serverdiskInput = $("#edit_server_disk");
        var serveripInput = $("#edit_server_ip");
        var serveruuidInput = $("#edit_server_uuid");
        var serverbusinessInput = $("#edit_server_business");
        var serverstatusInput = $('#modify_server_status option:selected');
        var serverremarkInput = $("#edit_server_remark");
        var rack_id = rackidInput.attr('id');
        var pk = serveridInput.val();
        var name = servernameInput.val();
        var cpu = servercpuInput.val();
        var memory = servermemoryInput.val();
        var disk = serverdiskInput.val();
        var ip = serveripInput.val();
        var uuid = serveruuidInput.val();
        var business = serverbusinessInput.val();
        var status = serverstatusInput.attr('status_id');
        var remark = serverremarkInput.val();
        data = {name:name, rack_id:rack_id, cpu:cpu, memory:memory, disk:disk, ip:ip, uuid:uuid, business:business, status:status, remark:remark};
        dukuajax.put({
            'url': '/cmdb/server/' + pk + '/',
            'data': data,
            'success': function (result) {
                if (result['code'] == 200) {
                    window.location.reload();
                }
            }
        });
    }); 
};

Server.prototype.listenGetApiRack = function () {
    $.ajax({
        type: 'GET',
        url: '/cmdb/api_racks',
        data: {},
        dataType: 'json',
        success: function (result) {
            data = result.data;
            options = "";
            for (const obj of data) {
                option = '<option id='+obj.id+'>'+obj.name+'</option>';
                options += option;
            }
            $('#create_rack_id').append(options);    
            $('#modify_rack_id').append(options);    
        }
    });
};

Server.prototype.listenSearchServer = function () {
    var self = this;
    var submitBtn = $("#search_btn");
    submitBtn.click(function (e) {
        e.preventDefault();
        var valueInput = $('#search_value').val();
        window.location.href = '/cmdb/server/?search=' + valueInput
    });
};

Server.prototype.showInformation = function () {
    var self = this;
    var showBtn = $('.show-btn');
    daqModal = $('#daq_modal');
    showBtn.click(function (e) {
        e.preventDefault();
        var self = $(this);
        var tr = self.parent().parent();
        var daq = tr.attr('data-daq');
        daq = eval('(' + daq + ')');
        html = '';
        for (let i in daq) {
            html += '<div>' + '<b>' + i + '</b>' + ': '+ daq[i] + '</div>';
        }
        daqModal.modal();
        $('#daq_content').html(html);
        var id = $.trim($(this).parents("tr").children("td").eq(0).text());
        $('#server_id').html('(ID: '+id+')');
      
    });
};

$(function () {
    var server = new Server();
    server.run();
});