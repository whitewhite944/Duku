function Optimize() {

}

Optimize.prototype.run = function () {
    var self = this;
    self.listenGetApiEnv();
    self.listenCheckOptimize();
    self.listenResetTextArea();
};

Optimize.prototype.listenGetApiEnv = function () {
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

Optimize.prototype.listenCheckOptimize = function () {
    var self = this;
    var checkOptimize = $('#check');
    checkOptimize.click(function (e) {
        e.preventDefault();
        var envInput = $('input[class="ace"]').filter(':checked');
        var dbnameInput = $('#dbname');
        var treaterInput = $('#treater');
        var sqlcontentInput = $('#sqlcontent');
        var remarkInput = $('#remark');
        var infoModal = $('#modal_info');
        var infoTitle = $('#modal_info_title');
        var infoContent = $('#modal_info_content');
        var sqlModal = $('#modal_sql_info');
        var sqlTitle = $('#modal_sql_title');
        var sqlContent = $('#modal_sql_content');
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
            url: '/sqlmng/optimize_check/',
            data: data,
            dataType: 'json',
            success: function (result) {
                btn.removeAttr("disabled");
                status = result.status;
                if (status == 0){
                    sqlModal.modal();
                    sqlTitle.html('SQL优化结果');
                    status = result.data;
                    sqlContent.html('<pre>'+status+'</pre>');
                }
            }    
        });
    });
};

Optimize.prototype.listenResetTextArea = function () {
    var btnReset = $('.btn-reset');
    btnReset.click(function (e) {
        e.preventDefault();
        var sqlcontentInput = $('#sqlcontent');
        sqlcontent = sqlcontentInput.val('');
    });
};


$(function () {
    var optimize = new Optimize();
    optimize.run();
});