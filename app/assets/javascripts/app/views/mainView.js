define([

	// Vendor
	'marionette',
	'handlebars',
	'bootstrap',

	// Templates
	'text!templates/navigation.hbs',
	'text!templates/mainPage.hbs',
	'text!templates/footer.hbs',
	'text!templates/navigationLoggedIn.hbs',
	'text!templates/battleReqModal.hbs',

	// Plugins
	'session',
	'ajaxHelper',

	], function (Marionette,Handlebars, bs, navigationTpl, mainPageTpl,
		footerTpl, navLoggedInTpl,battleReqModalTpl, Session, Ah) {


		var MainView = {

			NavigationView : Marionette.ItemView.extend({
				template: Handlebars.compile(navigationTpl),
				battleReqTmpl : Handlebars.compile(battleReqModalTpl),

				initialize : function() {
					if ( Session.getUser() ){
						this.changeNavBar();
					}
				},

				events : {
					'click .battleReqModal' : 'openBattleReqModal',
					'click .batReqAcc' : 'battleReqAccepted',
					'click .batReqDec' : 'battleReqDeclined'
				},

				changeNavBar : function() {
					this.template = Handlebars.compile(navLoggedInTpl);	
					this.loggedIn = true;							
				},

				onDomRefresh: function(){
					$('#popover').popover({html:true});
				},

				serializeData : function() {
					if ( this.loggedIn ){
						return {
							id : Session.getUser().id,
							username : Session.getUser().username,
							battleRequests : Session.getIncomingBattleRequests(),
							fanees : Session.getUser().fanees
						}
					}else{
						return {}
					}
				},

				battleReqDeclined : function(e) {
					console.log("saP nigas:" + e.currentTarget.id.split("-")[1]);
				},

				battleReqAccepted : function(e) {
					console.log("saP nig:" + e.currentTarget.id.split("-")[1]);
					this.b_index = e.currentTarget.id.split("-")[1];
					var battleReq = Session.getIncomingBattleRequests()[this.b_index]
					var id = battleReq.id;
					var url = "/api/battleRequests/" + id + "/accept/" + Session.getUser().id;
					Ah.post({
						url : url,
						handler: $.proxy(this.battleAccepted,this)
					})
				},

				battleAccepted : function() {
					console.log("accepted: " + this.b_index);
					this.b_index = null;
					mainController.trigger('user:battleAccepted');
				},

				openBattleReqModal : function(e) {
					e.preventDefault();
					console.log("saP:" + e.currentTarget.id.split("-")[1]);
					var index = e.currentTarget.id.split("-")[1];
					this.$('#battleReqWrapper').html(this.battleReqTmpl(
					{
						b :Session.getIncomingBattleRequests()[index]
					}
					));
					$('#battleReqModal').modal('show');

				},

				// render: function() {
				// 	console.log("render nav: " + JSON.stringify(Session.getUser()));
				// 	if ( this.loggedIn )
				// 		$(this.el).html(this.template());
				// 	else
				// 		$(this.el).html(this.template());
				// 	return this;  
				// }
			}),

MainLayout : Marionette.Layout.extend({
	template: Handlebars.compile(mainPageTpl),

	events : {
		"click #loginBtn" : "loginBtnClc",
		"click #regBtn" : "registerBtnClc",
		"click #authBtn" : "authBtnClk"
	},

	regions: {
		modal : "#modal",
		topShreds: "#topShreds",
		sotw : "#sotw",
		sweetShredders : "#sweetShredders"
	},


	

	registerBtnClc : function(event) {
		event.preventDefault();
		$.ajax({
			type:"POST",
			url: "users/create",
			data: {
				user : {
					username : $('#regUsername').val(),
					email : $('#regEmail').val(),
					password : $('#regPassword').val(),
					password_confirmation : $('#regPassword2').val()
				}
			},
			success: function(res) {
				console.log("SUCCESS: " + JSON.stringify(res));
			}
		});
	},

	loginBtnClc : function(event) {
		event.preventDefault();
		$('#authenticate').modal('show');
	},

	authBtnClk : function(event) {
		event.preventDefault();

		$.ajax({
			type:"POST",
			url: "sessions/login",
			beforeSend: function ( xhr ) {
				xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
			},
			data: {
				username_or_email : $('#inputUsername').val(),
				login_password : $('#inputPassword').val()
			},
			success: function(res) {
				$('#authenticate').modal('hide');
				mainController.trigger('authenticateSuccess', res);
			}, error: function(err) {
				$('#auth-error-msg').text("Asshole");
			}
		});				
	},

}),

FooterView : Marionette.ItemView.extend({
	template: Handlebars.compile(footerTpl),

	render: function() {

		$(this.el).html(this.template());
		return this;  
	}
})
};


return MainView;
});