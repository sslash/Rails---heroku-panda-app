define([
	'marionette',

	// Views
	'views/landingpage/landingPageView'

	], function (Marionette,LandingPageView ) {

	var MainController = Marionette.Controller.extend({

		/** Routing functions */
		landingPage : function() {
			console.log("landing page");
			var landingPage = new LandingPageView();
			Shredr.page.show(landingPage);
		}
	});

	return MainController;
});