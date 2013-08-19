define([
	// Vendor
	'marionette',
	'handlebars',
	'bootstrap',
	'underscore',
  	'ajaxHelper',
  	'session',

	// Templates
	'text!templates/battle/battleRequestModal.hbs'
	], function (Marionette,Handlebars, bs, _, Ah, Session, battleReqTmpl) {

		var BattleRequestView = {}

		BattleRequestView.ModalView = Marionette.ItemView.extend({

			template: Handlebars.compile(battleReqTmpl),



			events : {
				'hide #shredModal' : 'modalHidden',
				'click #rateBtn' : 'rateShred',
				'keypress #commentText' : 'saveComment',
				

				'click a' : 'categoryClicked',
				'click .btn-primary' : 'challengeSubmitted',
			},

			categoryClicked : function(e) {
				e.preventDefault();
				$('.icon-hand-left').remove();
				$('.selected').removeClass();
				$(e.target).after("<i class='icon-hand-left'></i>");
				$(e.target).addClass("selected");
			},

			challengeSubmitted : function(e){
				e.preventDefault();
				var file = $('#challengeFile')[0].files[0];
				var category = $('.selected').text();
				var url = '/api/battleRequests/create/' + Session.getUser().id + 
				'/' + this.model.get('id') + '/?style=' + category;
				file = Ah.verifyVideo(file);
				var that = this;
				if ( file ) {
					Ah.uploadFile({
						file : file,
						handler : function(res){
							Shredhub.trigger('')
							that.$('.challengeBox').html('');
							that.$('#challengeModal').modal('hide');
						},
						url : url
					});
				}
			},

			modalHidden : function() {
				this.close();
			},

			/* EVENT HANDLERS */
			onRender: function(){
				console.log("YEEEEAH");
				this.$('#challengeModal').modal('show');
			}
    	});

return BattleRequestView;
});
