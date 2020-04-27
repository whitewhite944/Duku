function Inception() {

}

Inception.prototype.run = function () {
    var self = this;
    self.listenGetApiEnv();
    self.listenCheckInception();
    self.listenResetTextArea();
    self.showInformation();
    self.listenHandleResult();
};

Inception.prototype.listenGetApiEnv = function () {
    var self = this;
    ace = $('.ace');
    ace.change(function (e) {
        e.preventDefault();
        var envCheck = $('input[class="ace"]').filter(':checked');
        var env = envCheck.val();
        data = {env:env};
        $.ajax({
            type: 'POST',
            url: '/sqlmng/api_env/',
            data: data,
            dataType: 'json',
            success: function (result) {
                dbname = result.env;
                treaters = result.treaters;
                dbname_options = "";
                treater_options = "";
                for (const obj of dbname) {
                    option = '<option>'+obj+'</option>';
                    dbname_options += option;
                }
                $('#dbname').empty();
                $('#dbname').append(dbname_options);
                for (const obj of treaters) {
                    option = '<option>'+obj+'</option>';
                    treater_options += option;
                }
                $('#treater').empty();
                $('#treater').append(treater_options);

            }
        });
    });
};

Inception.prototype.listenCheckInception = function () {
    var self = this;
    var checkInception = $('#check');
    checkInception.click(function (e) {
        e.preventDefault();
        var envInput = $('input[class="ace"]').filter(':checked');
        var dbnameInput = $('#dbname');
        var treaterInput = $('#treater');
        var sqlcontentInput = $('#sqlcontent');
        var remarkInput = $('#remark');
        var infoModal = $('#modal_info');
        var infoTitle = $('#modal_info_title');
        var infoContent = $('#modal_info_content');
        var btn = $('.btn');
        var env = envInput.val();
        var db_name = dbnameInput.val();
        var treater = treaterInput.val();
        var sql_content = sqlcontentInput.val();
        var remark = remarkInput.val();
        if (env == ''){
            infoModal.modal();
            infoContent.html('Warning：请选择环境');
            return false;
        }
        if (sql_content == ''){
            infoModal.modal();
            infoContent.html('Warning：SQL输入不能为空！');
            return false;
        }
        if (remark == ''){
            infoModal.modal();
            infoContent.html('Warning：备注不能为空！');
            return false;
        }
        if (db_name == null){
            infoModal.modal();
            infoContent.html('Wrning：请先添加数据库');
            return false;
        }
        if (treater == null){
            infoModal.modal();
            infoContent.html('Warning：请先添加执行人员');
            return false;
        }
        btn.attr({"disabled":"disabled"});
        data = {env:env, db_name:db_name, treater:treater, sql_content:sql_content, remark:remark};
        $.ajax({
            type: 'POST',
            url: '/sqlmng/inception_check/',
            data: data,
            dataType: 'json',
            success: function (result) {
                btn.removeAttr("disabled");
                status = result.status;
                if (status == 0){
                    infoModal.modal();
                    infoTitle.html('SQL审核结果');
                    infoContent.html('SQL语法审核通过! 请等待 ' + treater + ' 执行');
                }
                else if (status == '2'){
                    infoModal.modal();
                    infoTitle.html('SQL审核结果');
                    msg = result.message;
                    msghtml = '';
                    for (const i in msg){
                        msghtml += '<div>' + msg[i] + '</div>';
                    }
                    infoContent.html('错误信息：' + msghtml);
                }
                if (status == '-2') {
                    infoModal.modal();
                    infoTitle.html('SQL审核结果');
                    msg = result.message;
                    msghtml = '';
                    for (const i in msg){
                        msghtml += '<div>' + msg[i] + '</div>';
                    }
                    infoContent.html('错误信息：' + msghtml);
                }
            }    
        });
    });
};

Inception.prototype.listenResetTextArea = function () {
    var btnReset = $('.btn-reset');
    btnReset.click(function (e) {
        e.preventDefault();
        var sqlcontentInput = $('#sqlcontent');
        sqlcontent = sqlcontentInput.val('');
    });
};

Inception.prototype.listenHandleResult = function () {
    var self = this;
    var sqlaction = $('.sqlaction');
    errorModal = $('#error_modal');
    errorContent = $('#error_content');
    sqlaction.click(function (e) {
        e.preventDefault();
        var $this =$(this);
        var actiontype = $this.attr('actiontype');
        var inception_id = $this.attr('inception_id');
        if (actiontype == 'execute') {
            data = {pk:inception_id, actiontype:actiontype};
            $.ajax({
                type: 'POST',
                url: '/sqlmng/inception_result/',
                data: data,
                dataType: 'json',
                success: function (result) {
                    console.log(result);
                    status = result.status;
                    message = result.message;
                    if (status == 0) {
                        $("#forexcute_sql").load(location.href + "/sqlmng/inception_result/ .status", function () {
                            self.showInformation();
                            self.listenHandleResult();
                        });
                    }
                    if (status == -1) {
                        message = result.message.split(';');
                        html = '';
                        for (i in message){
                            if(message[i] == ''){break}
                            html += '<div>' + message[i] + ';' + '</div>';
                        }
                        errorModal.modal();
                        errorContent.html(html);
                        $("#forexcute_sql").load(location.href + "/sqlmng/inception_result/ .status", function () {
                            self.showInformation();
                            self.listenHandleResult();
                        });
                    }
                    if (status == 403) {
                        message = result.message.split(';');
                        html = '';
                        for (i in message){
                            if(message[i] == ''){break}
                            html += '<div>' + message[i] + ';' + '</div>';
                        }
                        errorModal.modal();
                        errorContent.html(html);
                        $("#forexcute_sql").load(location.href + "/sqlmng/inception_result/ .status", function () {
                            self.showInformation();
                            self.listenHandleResult();
                        });
                    }                    
                }           
            });            
        }
        if (actiontype == 'rollback') {
            data = {pk:inception_id, actiontype:actiontype};
            $.ajax({
                type: 'POST',
                url: '/sqlmng/inception_result/',
                data: data,
                dataType: 'json',
                success: function (result) {
                    status = result.status;
                    message = result.message;
                    if (status == -2) {
                        $("#forexcute_sql").load(location.href + "/sqlmng/inception_result/ .status", function () {
                            self.showInformation();
                            self.listenHandleResult();
                        });
                    }
                    if (status == 403) {
                        message = result.message.split(';');
                        html = '';
                        for (i in message){
                            if(message[i] == ''){break}
                            html += '<div>' + message[i] + ';' + '</div>';
                        }
                        errorModal.modal();
                        errorContent.html(html);
                        $("#forexcute_sql").load(location.href + "/sqlmng/inception_result/ .status", function () {
                            self.showInformation();
                            self.listenHandleResult();
                        });
                    }                             
                }           
            }); 
        }
        if (actiontype == 'canceled') {
            data = {pk:inception_id, actiontype:actiontype};
            $.ajax({
                type: 'POST',
                url: '/sqlmng/inception_result/',
                data: data,
                dataType: 'json',
                success: function (result) {
                    status = result.status;
                    message = result.message;
                    if (status == 1) {
                        $("#forexcute_sql").load(location.href + "/sqlmng/inception_result/ .status", function () {
                            self.showInformation();
                            self.listenHandleResult();
                        });
                    }
                    if (status == 403) {
                        message = result.message.split(';');
                        html = '';
                        for (i in message){
                            if(message[i] == ''){break}
                            html += '<div>' + message[i] + ';' + '</div>';
                        }
                        errorModal.modal();
                        errorContent.html(html);
                        $("#forexcute_sql").load(location.href + "/sqlmng/inception_result/ .status", function () {
                            self.showInformation();
                            self.listenHandleResult();
                        });
                    }                             
                }           
            });             
        }
    });
};

Inception.prototype.showInformation = function () {
    editBtn = $('.edit-btn');
    remarkBtn = $('.remark-btn');
    informationModal = $('#inforamtion_modal');
    inforamtionContent = $('#inforamtion_content');
    editBtn.on('click', function (e) { 
        e.preventDefault();
        var $this =$(this);
        inceptionSql = $this.attr('inception_sql').split(';');
        html = '';
        for (i in inceptionSql){
            if(inceptionSql[i] == ''){break}
            html += '<div>' + inceptionSql[i] + ';' + '</div>';
        }
        informationModal.modal();
        inforamtionContent.html(html);     
    });
    remarkBtn.click(function (e) { 
        e.preventDefault();
        var $this =$(this);
        inceptionRemark = $this.attr('inception_remark').split(';');
        html = '';
        for (i in inceptionRemark){
            if(inceptionRemark[i] == ''){break}
            html += '<div>' + inceptionRemark[i] + ';' + '</div>';
        }
        informationModal.modal();
        inforamtionContent.html(html);     
    });
};

$(function () {
    var inception = new Inception();
    inception.run();
});