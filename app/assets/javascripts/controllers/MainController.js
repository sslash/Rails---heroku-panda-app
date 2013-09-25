define([
	'marionette',

	// Views
	'views/nav/main',
	'views/landingpage/landingPageView',
	'views/stage/stageView',

	], function (Marionette, NavMainView, LandingPageView, StageView) {

	var MainController = Marionette.Controller.extend({

		/** Routing functions */
		landingPage : function() {
			this.renderNavigationView();
			this.renderLangingView();
			this.renderFooterView();
		},

		stagePage : function() {
			this.renderNavigationView();
			this.renderStageView();
		},

		/** Rendering functions */
		renderNavigationView : function(forced){
			if (forced || !this.navView) {
				this.navView = new NavMainView();
				Shredr.navigation.show(this.navView);
			}
		},

		renderLangingView : function(){
			var landingPage = new LandingPageView();
			Shredr.main.show(landingPage);
		},

		renderStageView : function() {
			var stageView = new StageView();
			Shredr.main.show(stageView);
		},

		renderFooterView : function(){
		}

	});

	return MainController;
});