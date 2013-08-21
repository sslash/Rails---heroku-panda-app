define([
	'marionette',

	// Views
	'views/mainView',
	'views/shredpoolView',
	'views/shredderView',
	'views/shredView',
	'views/editProfileView',
	'views/shredroomView',
	'views/battleView',
	'views/battleRequestView',

	// Models
	'models/user',
	'models/shredder',
	'models/shred',
	'models/battle',

	// Collections
	'collections/shredders',
	'collections/shreds',
	'collections/battles',

	'session'
	], function (Marionette, MainView, ShredpoolView, 
		ShredderView, ShredView, EditProfileView, ShredroomView,
		BattleView, BattleRequestView, User, Shredder, Shred, Battle, Shredders, 
		Shreds, Battles, Session) {

		var MainController = Marionette.Controller.extend({

			/*
			* Global event listeners should be on the form:
			*
			* category:resource:action
			*
			* E.g:
			*
			* regions:modal:showBadge
			*
			*/
			initialize: function(options){
				this.listenTo(this, "authenticateSuccess", this.authenticateSuccess);
				this.listenTo(this, "sessionDataFetched", this.sessionDataFetched);
				this.listenTo(this, "mainLayout:rendered", this.mainLayoutRendered);
				this.listenTo(this, "shredpoolView:rendered", this.shredpoolViewRendered);
				this.listenTo(this, "show:shredModal", this.showShredModal);
				this.listenTo(this, "action:addFanee", this.addFanee);
				this.listenTo(this, "action:updateNavBar", this.updateNavBar);
				this.listenTo(this, "shredroom:rendered", this.shredroomViewRendered);	
				this.listenTo(this, "user:battleAccepted", this.battleAccepted);	
				this.listenTo(this, "battle:battleRequest:showModal", this.showBattleRequest);
				this.listenTo(this, "shred:createShred:showModal", this.showCreateShredModal);
				this.listenTo(this, "regions:modal:showBadge", this.showBadgeModal);
				this.listenTo(this, "regions:modal:hideModal", this.hideModal);
			},

			shredderPage : function(id){
				this.__renderNavbar();
				var that = this;
				new Shredder({id: id}).fetch({
					success : that.shredderExistPage,
					error : that.shredderNoExistPage
				});
			},

			shredderExistPage : function(shredder) {
				var mainView = new ShredderView.ProfileView({model : shredder});
				mainView.render();
				Shredhub.main.show(mainView);
			},

			shreddersPage : function() {
				this.__renderNavbar();
				var that = this;
				var collection = new Shredders();
				collection.fetch({
					success : that.renderShreddersPage
				});
			},

			renderShreddersPage : function(shredders) {
				this.__renderNavbar();
				var mainView = new ShredderView.ShreddersView({collection : shredders});
				//mainView.render();
				Shredhub.main.show(mainView);
			},

			homePage : function() {			
				var that = this;
				this.__renderNavbar();

				// Init main layout
				this.mainView = new MainView.MainLayout();				
				this.mainView.render();
				this.mainView.on("show", function(){
					that.trigger("mainLayout:rendered");
				});

				var footerView = new MainView.FooterView();
				footerView.render();

				window.Shredhub.header.show(this.navigationView);
				window.Shredhub.main.show(this.mainView);
				window.Shredhub.footer.show(footerView);				
			},

			editProfilePage : function() {
				var user = new Shredder(Session.getUser());
				var editProfileView = new EditProfileView({model : user});
				Shredhub.main.show(editProfileView);
			},

			showroomPage : function(uid) {
				this.__renderNavbar();
				var user = new Shredder({id: uid});
				var shredders = new Shredders();
				var view = new ShredroomView({model : user, collection: shredders});
				var that = this;
				Shredhub.main.show(view);
				user.fetch();
				shredders.fetch({reset:true});
			},

			battlePage : function(uid) {
				this.__renderNavbar();
				if (uid === undefined) {
					uid = "52012d473ae74073b800161c";
				}
				var battle = new Battle({id: uid});
				var battles = new Battles();
				var view = new BattleView({model : battle});//, collection : battles});
				var that = this;
				Shredhub.main.show(view);
				battle.fetch();
				//battles.fetch({reset:true});
			},

			__renderNavbar : function() {
				if (!this.navigationView) {
					this.navigationView = new MainView.NavigationView();
					Shredhub.header.show(this.navigationView);
				}
			},

			addFanee : function(fanee){
				if ( !this.user )
					this.user = new User();

				this.user.addFaneeRelationship(fanee);
			},

			authenticateSuccess : function(user) {
				console.log("user: " + JSON.stringify(user));
				this.user = new User();
				this.user.initUser(user);
				router.navigate("shredpool", {trigger: true});
			},

			logout : function() {
				if ( this.user )
					this.user.doLogOut();
				else
					new User().doLogOut();
			},

			shredpoolPage : function() {
				this.__renderNavbar();
				this.shredpoolView = new ShredpoolView.MainLayout();
				var that = this;
				this.shredpoolView.on("show", function(){
					that.trigger("shredpoolView:rendered");
				});
				Shredhub.main.show(this.shredpoolView);
			},

			sessionDataFetched : function() {
				this.navigationView.changeNavBar();
				this.navigationView.render();
			},

			updateNavBar : function() {
				this.navigationView.render();
			},

			/* Layout rendered'z */
			mainLayoutRendered : function() {
				
				// Render top shreds
				var topShreds = new Shreds();
				var topShredsView = new ShredView.RowView({collection : topShreds});				
				this.mainView.topShreds.show(topShredsView);
				topShreds.trigger("fetch:topShreds");

				// Render Shredder of the week
				var sotw = new Shredder();
				sotw.initURL({url : '/api/shredders/sotw'});
				var sotwView = new ShredderView.Sotw({model: sotw});
				this.mainView.sotw.show(sotwView);
				sotw.trigger("fetch:sotw");

				// Render Sweet shreds
				var sweetShredders = new Shredders();
				var sweetView = new ShredderView.ShreddersRow({collection : sweetShredders});				
				this.mainView.sweetShredders.show(sweetView);
				sweetShredders.trigger("fetch:sweetShredders");
			},

			shredpoolViewRendered : function() {

				// Fetch initial shreds
				var initialShreds = new Shreds();
				var shredsView = new ShredpoolView.ShredsInPoolView({collection : initialShreds});				
				this.shredpoolView.shreds.show(shredsView);
				initialShreds.trigger("fetch:shredpoolShreds");
			},

			showShredModal : function(shred) {
				shred.increaseViewed();
				this.modalView = new ShredView.ModalView({model : shred});
				Shredhub.modal.show(this.modalView);
			},

			battleAccepted : function(){
				if ( !this.user )
					this.user = new User();
				this.user.resetUser();
			},

			showBattleRequest : function(shredderModel) {
				var view = new BattleRequestView.ModalView({model: shredderModel});
				Shredhub.modal.show(view);
			},

			showCreateShredModal : function() {
				var view = new ShredView.CreateShredView();
				Shredhub.modal.show(view);
			},

			hideModal : function() {
				Shredhub.modal.close();
			},

			// Show a badge in the modal region
			showBadgeModal : function(modalView) {

			}
		});

		return MainController;
	});