function Base() {

}

Base.prototype.run = function () {
    var self = this;
    self.handleNavSwitch();
};

Base.prototype.handleNavSwitch = function () {
    var url = window.location.href;
    var protocol = window.location.protocol;
    var host = window.location.host;
    var domain = protocol + '//' + host;
    var path = url.replace(domain, '');
    var NavList = $("#tree li");
    NavList.each(function (index, element) { 
        var li = $(element);
        var Tag = li.children("a");
        var href = Tag.attr("href");
        if (href === path) {
            Tag.addClass("active");
            return false;
        }     
    });
};

$(function () {
    var base = new Base();
    base.run();
});