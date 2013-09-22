define([
	'marionette',

	// Views
	'views/modal/loginModalView',
	'views/modal/messageModal',

	], function (Marionette, LoginModalView, MessageModal) {

	var EventController = Marionette.Controller.extend({

		openLoginModal : function() {
			var modal = new LoginModalView.MainView();
			Shredr.modal.show(modal);
		},

		openMessageModal : function() {
			Shredr.modal.show(new MessageModal.MainLayout({model : Shredr.user}));
		}
	});

	return EventController;
});