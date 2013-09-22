define([
	'marionette',

	// Views
	'views/landingpage/landingPageView'

	], function (Marionette,LandingPageView ) {

	var MainController = Marionette.Controller.extend({

		/** Routing functions */
		landingPage : function() {
			console.log("landing page");
		}
	});

	return MainController;
});