define([
	'marionette',

	// Views
	'views/landingpage/landingPageView'

	], function (Marionette,LandingPageView ) {

	var MainController = Marionette.Controller.extend({

		/** Routing functions */
		landingPage : function() {
			var landingPage = new LandingPageView();
			Shredr.page.show(landingPage);
		}
	});

	return MainController;
});