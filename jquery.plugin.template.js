// *jquery.plugin.template.js* is an answer to my search for a good generic
// template to base all kinds of plugins off of. It is flexible and uses the 
// latest ideas from Twitter Bootstrap and other places online. One of the 
// more useful things is the use of jQuery's data API and the calling of 
// different methods via the plugin after initialization.
//
// ```javascript
// // Initialize it
// $('.myselector').myplugin({setting1: 'one', setting2: 'two'});
// ...
// // Call a method on it
// $('.myselector').myplugin('mymethod');
// ```

// Wrap everything in a define for require.js
define(['jquery'], function($) {

    var MyPlugin = function(element, options) {
        // Context variable
        var myplugin = this;

        // Set the element as an attribute on the plugin object for future reference.
        this.$element = $(element);

        // Extend the user-defined options with your sensible defaults.
        this.options = $.extend({}, $.fn.myplugin.defaults, options);

        // Bind any events using an anonymous function to add the context of the 
        // plugin
        this.$element.bind('mouseover', function() {myplugin.publicMethod();});
    };

    MyPlugin.prototype = {

        my_attribute: 'value',

        _privateMethod: function() {},

        publicMethod: function() {}

    };

    // This is what jQuery will call
    $.fn.myplugin = function(option) {
        // Always start out with this.each to be able to cover more than one element
        return this.each(function () {
            var $this = $(this),
                // Store per element information using jQuery's data API using the name
                // of the plugin.
                data = $this.data('myplugin'),
                // Initialization of the plugin should be done with an object
                options = typeof option == 'object' && option;

            // First time run initializes a new Plugin object
            if (!data) {
                // Each Plugin object receives the element and the options send when initialized
                // The data for 'myplugin' is set to the MyPlugin object itself.
                $this.data('myplugin', (data = new MyPlugin(this, options)));
                // *This is the important part*: allow for the calling of methods in the Plugin object
                // after initialization such that one can do $(".selector").plugin('mymethod')
                // thereby exposing an easy to use API.
            } else if (typeof option == 'string') {
                // Call the method
                data[option]();
            }
        });
    };

    // Use a separate and easy to understand options dictionary for default 
    // settings. Users can refer to these to understand the plugin.
    $.fn.myplugin.defaults = {
        width: 500000,
        text: 'Crazy man'
    };

});
