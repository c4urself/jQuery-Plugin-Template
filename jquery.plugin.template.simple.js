
var MyPlugin = function (element, options) {
    var myplugin = this;
    this.$element = $(element);
    this.options = $.extend({}, $.fn.myplugin.defaults, options);

    this.$element.on('mouseover', function () {myplugin.publicMethod();});
};


MyPlugin.prototype = {
    myAttribute: 'value',
    _privateMethod: function () {},
    publicMethod: function () {}
};


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        factory(window.jQuery);
    }
}(function ($) {


    $.fn.myplugin = function (option) {
        var args = [].splice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                data = $this.data('myplugin'),
                options = typeof option === 'object' && option;

            if (!data) {
                $this.data('myplugin', (data = new MyPlugin(this, options)));
            } else if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    };


    $.fn.myplugin.defaults = {
        width: 500000,
        text: 'Crazy man'
    };

}));
