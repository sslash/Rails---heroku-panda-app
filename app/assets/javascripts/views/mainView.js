define([

	// Vendor
	'marionette',
	'handlebars',
	'bootstrap',

	// Views
	'views/navbar/newFaneesView',

	// Templates
	'text!templates/navigation.hbs',
	'text!templates/mainPage.hbs',
	'text!templates/footer.hbs',
	'text!templates/navigationLoggedIn.hbs',
	'text!templates/battleReqModal.hbs',

	// Plugins
	'session',
	'ajaxHelper'

	], function (Marionette,Handlebars, bs, NewFaneesView, navigationTpl, mainPageTpl,
		footerTpl, navLoggedInTpl,battleReqModalTpl, Session, Ah) {


		var MainView = {

			NavigationView : Marionette.Layout.extend({
				template: Handlebars.compile(navigationTpl),
				battleReqTmpl : Handlebars.compile(battleReqModalTpl),

				regions: {
					newFans: "#newFans"	
				},

				initialize : function() {
					if ( Session.getUser() ){
						this.changeNavBar();
					}
				},

				events : {
					'click .battleReqModal' : 'openBattleReqModal',
					'click .batReqAcc' : 'battleReqAccepted',
					'click .batReqDec' : 'battleReqDeclined',
					'click .createShred' : '__createShredClicked',
				},

				onRender : function() {
					if ( Shredhub.loggedIn ){
						this.newFansView = new NewFaneesView.View();
						this.newFans.show(this.newFansView);
					}
				},

				changeNavBar : function() {
					this.template = Handlebars.compile(navLoggedInTpl);	
					Shredhub.loggedIn = true;							
				},

				onDomRefresh: function(){
					$('#popover').popover({html:true});
				},

				serializeData : function() {
					
					if ( Shredhub.loggedIn ){
						var user = Session.getUser();
						var img = user.onlineProfileImagePath ? 
							user.onlineProfileImagePath : "/uploads/" + user.profileImagePath;
						return {
							id : user.id,
							username : user.username,
							battleRequests : Session.getIncomingBattleRequests(),
							profilePic : img

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
					var index = e.currentTarget.id.split("-")[1];
					this.$('#battleReqWrapper').html(this.battleReqTmpl(
					{
						b :Session.getIncomingBattleRequests()[index]
					}
					));
					$('#battleReqModal').modal('show');

				},

				__createShredClicked : function() {
					mainController.trigger('shred:createShred:showModal');
				}
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

	initialize : function() {
		this.__setUpFaceLogin();
	},

	serializeData : function (){
		return {
			isLoggedIn : (Shredhub.user !== undefined)
		}
	},

	__setUpFaceLogin : function() {
		$.ajax({
			url: window.location.protocol + "//connect.facebook.net/en_US/all.js",
			dataType: 'script',
			cache: true
		});

		window.fbAsyncInit = function(){
			FB.init({appId: '322423007904195', cookie: true})

			$('#sign_in').click(function(e) {
				e.preventDefault();
				FB.login (function(response){
					if (response.authResponse)
						window.location = '/auth/facebook/callback';
				});
			});
		}
	},

	// __facebookLogoutClicked : function(e) {
	// 	FB.getLoginStatus (function(response){ 
	// 		if (response.authResponse)
	// 			FB.logout();
	// 		return true;
	// 	});
	// },


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
				$('#registerModal').modal('hide');
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
			// beforeSend: function ( xhr ) {
			// 	xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
			// },
			data: {
				username_or_email : $('#inputUsername').val(),
				login_password : $('#inputPassword').val()
			},
			success: function(res) {
				$('#authenticate').modal('hide');
				//authenticateSuccess
				mainController.trigger('auth:login:success', res);
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