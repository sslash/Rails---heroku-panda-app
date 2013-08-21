// define([
// 	'marionette',
// 	'views/MainView'
// 	], function (Marionette, MainView) {

// 		var MainController = Marionette.Controller.extend({

// 			initialize: function(options){
// 			},

// 			shredderPage : function(){
// 				console.log("shredder page");
// 			},

// 			homePage : function() {
// 				console.log("home page");				

// 				var navigationView = new MainView.NavigationView();
// 				navigationView.render();

// 				var mainView = new MainView.MainLayout();
// 				mainView.render();

// 				var footerView = new MainView.FooterView();
// 				footerView.render();

// 				window.Shredhub.header.show(navigationView);
// 				window.Shredhub.main.show(mainView);
// 				window.Shredhub.footer.show(footerView);
// 			}

// 		});

// 		return MainController;
// 	});;define([
// 	'marionette',
// 	'handlebars',
// 	'text!templates/navigation.hbs',
// 	'text!templates/mainPage.hbs',
// 	'text!templates/footer.hbs'
// 	], function (Marionette,Handlebars,navigationTpl, mainPageTpl, footerTpl) {


// 	var MainView = {

// 		NavigationView : Marionette.ItemView.extend({
// 			template: Handlebars.compile(navigationTpl)
// 		}),

// 		MainLayout : Marionette.Layout.extend({
// 			template: Handlebars.compile(mainPageTpl)
// 		}),

// 		FooterView : Marionette.ItemView.extend({
// 			template: Handlebars.compile(footerTpl),

// 			render: function() {

// 				$(this.el).html(this.template());
// 				return this;  
// 			}
// 		})
// 	};


// 	return MainView;
// });;require.config({
// 	baseUrl:'app/',
// 	paths : {
// 		backbone : 'vendor/backbone',
// 		underscore : 'vendor/underscore',
// 		jquery : 'vendor/jquery',
// 		marionette : 'vendor/backbone.marionette',
// 		handlebars : 'vendor/handlebars',
// 		text : "vendor/text",
// 		//'hbs/underscore' : "vendor/underscore",
// 		//'hbs/i18nprecompile' : 'vendor/hbs/i18nprecompile',
//       	//'hbs/json2' : 'vendor/hbs/json2',
// 		'backbone.wreqr' : 'vendor/backbone.wreqr',
//     	//backbone.eventbinder : 'path/to/backbone.eventbinder',
//     	'backbone.babysitter' : 'vendor/backbone.babysitter',
//     	//marionetteHandlebars : 'vendor/backbone.marionette.handlebars',
//     	//hbs : 'vendor/hbs'
// 	},
// 	shim : {
// 		jquery : {
// 			exports : 'jQuery'
// 		},
// 		underscore : {
// 			exports : '_'
// 		},
// 		backbone : {
// 			deps : ['jquery', 'underscore'],
// 			exports : 'Backbone'
// 		},
// 		marionette : {
// 			deps : ['jquery', 'underscore', 'backbone'],
// 			exports : 'Marionette'
// 		},
		
// 		handlebars: {
//       		deps: [],
//       		exports: "Handlebars"
//     	}
// 	},
	
// });

// require( ["main"],
//     function(myApp) {
//         //This function will be called when all the dependencies
//         //listed above are loaded. Note that this function could
//         //be called before the page is loaded.
//         //This callback is optional.
//         console.log("Shredhub up and running: ");
//     }
//   );
// ;define([
//   'marionette',
//   'controllers/MainController',
//   'router'
//     ], function (Marionette,MainController, AppRouter) {

//     Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
//       return Handlebars.compile(rawTemplate);
//     };

//     // set up the app instance
//     window.Shredhub = new Marionette.Application();

//     // configuration, setting up regions, etc ...
//     Shredhub.addRegions({
//      header : '#header',
//      main   : '#main',
//      footer : '#footer'
//    });


//   Shredhub.addInitializer(function(options){
//     new AppRouter({controller:options.controller});
//     Backbone.history.start();
//   });

//   console.log("will start");
//   var controller = new MainController();
//   Shredhub.start({controller : controller} );
//   return Shredhub;
// });; define([
//  	'marionette'
//  	],function (Marionette) {

//  		var AppRouter = Backbone.Marionette.AppRouter.extend({
//     		// "someMethod" must exist at controller.someMethod
//     		appRoutes: {
//     			"*action"   : "homePage",
//     			"shredder"  : "shredderPage"
//     		},
// 		});

//  		return AppRouter;
//  	});