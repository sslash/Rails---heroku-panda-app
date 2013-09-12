require.config({
	baseUrl:'assets/',
	paths : {
		backbone : 'vendor/backbone',
		underscore : 'vendor/underscore',
		jquery : 'vendor/jquery',
		marionette : 'vendor/backbone.marionette',
		handlebars : 'vendor/handlebars',
		text : "vendor/text",
		'backbone.wreqr' : 'vendor/backbone.wreqr',
    	'backbone.babysitter' : 'vendor/backbone.babysitter',
    	bootstrap : 'vendor/bootstrap.min',
    	//panda: '//cdn.pandastream.com/u/2.0/panda-uploader.min'
	},
	shim : {
		jquery : {
			exports : 'jQuery'
		},
		underscore : {
			exports : '_'
		},
		backbone : {
			deps : ['jquery', 'underscore'],
			exports : 'Backbone'
		},
		marionette : {
			deps : ['jquery', 'underscore', 'backbone'],
			exports : 'Marionette'
		},
		
		handlebars: {
      		deps: [],
      		exports: "Handlebars"
    	},
    	// Twitter Bootstrap depends on jQuery.
    	bootstrap : ["jquery"],
    	// panda : {
    	// 	exports : 'panda'
    	// }
	},
	
});

require( ["main"],
    function(myApp) {
        //This function will be called when all the dependencies
        //listed above are loaded. Note that this function could
        //be called before the page is loaded.
        //This callback is optional.
        console.log("Shredhub up and running: ");
    }
  );
