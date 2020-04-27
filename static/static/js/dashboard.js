function Dashboard() {

}

Dashboard.prototype.run = function () {
    var self = this;
    self.listenGetApiData();
};

Dashboard.prototype.listenGetApiData = function () {
    $.ajax({
        type: 'GET',
        url: '/cmdb/api_dashboard/',
        data: {},
        dataType: 'json',
        success: function (result) {
            data = result.data_site;
            donut_name = result.data_donut_name;
            donut_data = result.data_donut_data;
            html_sites = "";
            for (const obj of data) {
                html_site = 
                '<div class="progress-group">'+
                    obj.name+
                    '<span class="float-right"><b>'+obj.site+'</b>'+'/'+obj.total_site+'</span>'+
                    '<div class="progress progress-sm">'+
                    '<div class="progress-bar bg-primary" style="width: 80%"></div>'+
                    '</div>'+
                '</div>'
                html_sites += html_site;
            }
            $('#sites').html(html_sites); 
            var donutChartCanvas = $('#donutChart').get(0).getContext('2d');
            var donutData        = {
              labels: donut_name,
              datasets: [
                {
                  data: donut_data,
                  backgroundColor : ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc', '#d2d6de'],
                }
              ]
            };
            var donutOptions     = {
              maintainAspectRatio : false,
              responsive : true,
            };
            var donutChart = new Chart(donutChartCanvas, {
              type: 'doughnut',
              data: donutData,
              options: donutOptions      
            });   
        }
    });
};

$(function () {
    var dashboard = new Dashboard();
    dashboard.run();
});
    