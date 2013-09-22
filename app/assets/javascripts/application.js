define([
	'marionette',
	'handlebars',
	'controllers/eventController',
	'controllers/mainController',
	'mainRouter',

	// models
	'models/user'
	], function (Marionette, Handlebars, EventController, MainController, MainRouter, User) {

		Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
			return Handlebars.compile(rawTemplate);
		};

		Shredr = new Backbone.Marionette.Application();

		Shredr.on("initialize:before", function(options){
			this.addRegions({
				"navigation" : "#navigation",
				"modal" : "#modal",
				"main" : "#main",
				"footer" : "#footer"
			});
		});

		Shredr.addInitializer(function(options) {
			$.ajaxSetup({
				beforeSend: function(xhr) {
					xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
				}
			}); 
		});

		Shredr.vent.on("user:auth:success", function(userdata) {
			Shredr.loggedIn = true;
			Shredr.user = new User(userdata);
			Shredr.mainController.renderNavigationView(true);
		});

		Shredr.addInitializer(function(options){
			this.router = new MainRouter({controller:options.controller});
			Backbone.history.start();
		});

		Shredr.on("initialize:before", function(options){
			if ( window.user ) {
				Shredr.vent.trigger("user:auth:success", window.user);
			}
		});

		Shredr.on("initialize:after", function(options){
			if (window.message && window.message === "user:register:success")
				Shredr.buzz.openMessageModal();
		});

		Shredr.mainController = new MainController();
		Shredr.buzz = new EventController();
		Shredr.start({controller : Shredr.mainController} );

});