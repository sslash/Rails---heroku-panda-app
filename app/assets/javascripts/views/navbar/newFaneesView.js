define([

	// Vendor
	'marionette',
	'handlebars',
	'bootstrap',

	// Plugins
	'session',

	'text!templates/navbar/newFanees.hbs'
	], function (Marionette,Handlebars, bs, Session, newFaneesTmpl) {

		var NewFaneesView = {
			View : Marionette.ItemView.extend({
				template: Handlebars.compile(newFaneesTmpl),

				events : {
					"click #newFans" : "__newFansIconClicked"
				},

				serializeData : function() {
					if ( Shredhub.user ){
						var newFanees = Shredhub.user.getNewFansSinceLastLogin();
						var hasNewFans = newFanees.length > 0 ;
						return {
							newFanees : newFanees,
							hasNewFans : hasNewFans
						}
					
					}
					
				},

				onDomRefresh : function() {
					$('.dropdown-toggle').dropdown();
					$('.dropdown-toggle').on('click', $.proxy(this.__newFansIconClicked,this));
				},

				__newFansIconClicked : function(e) {
					$('.newFansIcon').removeClass('newFansIcon');
				}

			})

		};

		return NewFaneesView;
	});