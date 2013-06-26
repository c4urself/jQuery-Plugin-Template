// *jquery.plugin.template.js* is an answer to my search for a good generic
// template to base all kinds of plugins off of. It is flexible and uses the 
// latest ideas from Twitter Bootstrap and other places online. One of the 
// more useful things is the use of jQuery's data API and the calling of 
// different methods via the plugin after initialization.
//

// ## Benefits
//
// * your jQuery plugins can be initialized with a settings object `{height: 500, width: 300}`
// * the user-specified settings override a separate self-referencing default settings object -- a common jQuery plugin best practice
// * you can call methods on the plugin after initialization, whenever you want
// * takes best practices from Twitter Bootstrap and others
// * AMD compatible

// ## Get started
// 1. Copy [the template](https://raw.github.com/c4urself/jQuery-Plugin-Template/master/jquery.plugin.template.simple.js)
// 2. Change the name of the plugin ('myplugin')
// 3. Add your methods 
// 4. Joy!

//
// ## API
// **Initialize your plugin**
//
// ```
// $('.myselector').myplugin({setting1: 'one', setting2: 'two'});
// ```
//
// **Call a method**
//
// ```
// $('.myselector').myplugin('mymethod');
// ```
//
// **Call a method with arguments**
//
// ```
// $('.myselector').myplugin('mymethod', 'high', 45, false);
// ```

// ## References
// 
// * [jQuery Plugin Authoring](http://docs.jquery.com/Plugins/Authoring)
// * [Twitter Bootstrap Plugins](https://github.com/twitter/bootstrap/tree/master/js)
// * [jQuery plugin AMD compatibility](https://github.com/umdjs/umd/blob/master/jqueryPlugin.js)
//

// The constructor for the plugin sets some sensible data, like options and a reference to the element
var MyPlugin = function (element, options) {
    // Context variable
    var myplugin = this;
    // Set the element as an attribute on the plugin object for future reference.
    this.$element = $(element);
    // Extend the user-defined options with your sensible defaults.
    this.options = $.extend({}, $.fn.myplugin.defaults, options);

    // You can extend below here by adding any events you may need to always be available.
    // Bind any events using an anonymous function to add the context of the 
    // plugin
    this.$element.on('mouseover', function () {myplugin.publicMethod();});
};

MyPlugin.prototype = {

    // Have added a few conventions here. You can add attributes, private and public method here. The idea being that you only call methods not starting with underscore (it is not enforced)
    myAttribute: 'value',
    _privateMethod: function () {},
    publicMethod: function () {}
};


// This self-calling function is used to make the plugin work with either AMD or non-AMD contexts,
// it loads a function called `factory` which takes jQuery as an argument. This makes the plugin
// compatible with either AMD or non-AMD loading
(function (factory) {
    // *AMD variant*. Register as an anonymous module, jQuery will be passed in.
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    // *Browser global variant*. jQuery still passed in, not using AMD.
    } else {
        factory(window.jQuery);
    }
// This is our `factory` function, basically wrapping the plugin in a function that defines jQuery as `$`
}(function ($) {

    // This is what jQuery will call
    $.fn.myplugin = function (option) {
        // In cases where you want to call a method on your plugin with arguments, 
        // this puts all the arguments except for the method name into an array and sends them along to the function.
        var args = [].splice.call(arguments, 1);
        // Always start out with this.each to be able to cover more than one element
        return this.each(function () {
            var $this = $(this),
                // Store per element information using jQuery's data API using the name
                // of the plugin.
                data = $this.data('myplugin'),
                // Initialization of the plugin should be done with an object
                options = typeof option === 'object' && option;

            // *Initialization with settings object* run initializes a new Plugin object
            // Each Plugin object receives the element and the options send when initialized, 
            // the data for 'myplugin' is set to the MyPlugin object itself.
            if (!data) {
                $this.data('myplugin', (data = new MyPlugin(this, options)));

            // *Method calling with arguments*: allow for the calling of methods in the Plugin object
            // after initialization such that one can do `$(".selector").plugin('mymethod')`
            // thereby exposing an easy to use API. Call the method, the args we have extracted 
            // earlier are passed to the called method
            //
            // **Example:** 
            // `$('.myselector').myplugin('turnDegrees', 45);`
            } else if (typeof option === 'string') {
                data[option].apply(data, args);
            }
        });
    };

    // Use a separate and easy to understand options dictionary for default 
    // settings. Users can refer to these to understand the plugin.
    $.fn.myplugin.defaults = {
        width: 500000,
        text: 'Crazy man'
    };

}));

