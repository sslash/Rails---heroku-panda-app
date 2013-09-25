define([
  'marionette',
  'handlebars',
  'bootstrap',

  'views/stage/thumbCollectionView',
  'views/shred/shredView',
  'views/shred/createShredView',

  'collections/shredsCollection',

  // Templates
  'text!templates/stage/mainStage.hbs',
  ],function (Marionette, Handlebars, bs, ThumbCollectionView, ShredView, CreateShredView, ShredsCollection, tpl) {

  StageView = Backbone.Marionette.Layout.extend({
		template : Handlebars.compile(tpl),

    initialize : function() {
      this.collection = new ShredsCollection();
    },

    regions : {
      main : "#thumbs"
    },

    ui : {
      banner : "#banner",
      row : ".banner-content"
    },

    events : {
      "click #createShred" : "__createShredBtnClicked",
      "submit #searchForm": "__searchFormSubmitted"
    },

    serializeData : function() {
      if (Shredr.loggedIn) {
        return {
          user : Shredr.user.toJSON()
        };
      }
    },

    onRender : function() {
      this.thumbCollectionView = new ThumbCollectionView({collection : this.collection});
      this.main.show(this.thumbCollectionView);
      this.thumbCollectionView.on("thumb:pressed", $.proxy(this.changeMainSection, this, this.displayShred));
    },

    __searchFormSubmitted : function(e) {
      e.preventDefault();
      var text = e.currentTarget[0].value;
      this.collection.setSearchTerm(text);
      this.collection.fetch({reset:true});
      
    },

    __createShredBtnClicked : function() {
      this.changeMainSection(this.launchCreateShred);
    },

    changeMainSection : function(showFunction, thumb) {
      var that = this;
      this.main.close();

      // hide banner
      this.ui.banner.animate({
        height: "-=440px"
        }, "slow", function() {
          $.proxy(that.bannerHidden(showFunction, thumb), that);
        }
      );
    },

    bannerHidden : function(showFunction, shred) {
      // Hide all the thumbs
      this.ui.row.hide();
      //this.ui.banner.addClass("selectable");
      //this.ui.banner.on('click', $.proxy(this.showBanner, this));
      showFunction.call(this, shred);
    },

    showBanner : function() {
      this.ui.row.show();
      this.ui.banner.animate({
        height: "+=440px"
      }, "slow");
      this.main.show(this.thumbCollectionView);
    },

    launchCreateShred : function() {
      var createView = new CreateShredView();
      this.listenToOnce(Shredr.vent, 'shred:save:success', $.proxy(this.displayShred, this));
      this.main.show(createView);
    },

    displayShred : function(shred) {
      var shredView = new ShredView({model : shred});
      this.main.show(shredView);
    }
  });

  return StageView;
});