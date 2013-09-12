 define([
 	'marionette'
 	],function (Marionette) {

 		var AppRouter = Backbone.Marionette.AppRouter.extend({
    		// "someMethod" must exist at controller.someMethod
    		appRoutes: {
    			"shredders/:shredderId" : "shredderPage",
    			"shredders" 			: "shreddersPage",
    			"shredpool"				: "shredpoolPage",
                "battles/:uid"          : "battlePage",
                "battles/"              : "battlePage",
    			"editProfile" 			: "editProfilePage",
    			"logout"				: "logout",
                "showroom/:uid"         : "showroomPage",
                "showroom"              : "showroomPage",
    			"*action"   			: "homePage"
    		},
		});

 		return AppRouter;
 	});