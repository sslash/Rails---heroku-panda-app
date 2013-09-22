define([
	'marionette',
	'handlebars',

	'text!templates/nav/mainNav.hbs'
	], function (Marionette, Handlebars, tpl) {

		MainNav = Backbone.Marionette.ItemView.extend({
			template: Handlebars.compile(tpl),

			serializeData : function() {
				if (Shredr.loggedIn) {
					return {
						loggedIn: Shredr.loggedIn,
						user : Shredr.user.toJSON()
					};
				}
			}
		});

		return MainNav;
});

