define([
	// Vendor
	'marionette',
	'handlebars',
	'bootstrap',
	'underscore',

	// Templates
	'text!templates/badges/badgeModalView.hbs'
	], function (Marionette,Handlebars, bs, _, badgeModalViewTpl) {

		var BadgeView = {}

		BadgeView.ModalView = Marionette.ItemView.extend({

			template: Handlebars.compile(badgeModalViewTpl),

			events : {
				'click #okBadgeBtn' : '__modalHidden'
			},

			onRender: function(){
				this.$('#badgeModal').modal('show');
			},

			__modalHidden : function() {
				mainController.trigger('regions:modal:hideBadge');
			}
    	});

	return BadgeView;
});
