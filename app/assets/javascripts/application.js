define([
	'marionette',
	'handlebars',
	'controllers/mainController',
	'mainRouter',

	// models
	], function (Marionette, Handlebars,MainController, MainRouter) {

		Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
			return Handlebars.compile(rawTemplate);
		};

		Shredr = new Backbone.Marionette.Application();

		Shredr.on("initialize:before", function(options){
			this.addRegions({
			});
		});

		Shredr.addInitializer(function(options) {
			$.ajaxSetup({
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}); 
		});

		Shredr.addInitializer(function(options){
			this.router = new MainRouter({controller:options.controller});
			Backbone.history.start();
		});

		Shredr.mainController = new MainController();
		Shredr.start({controller : Shredr.mainController} );

});