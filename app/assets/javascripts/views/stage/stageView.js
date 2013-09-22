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

    regions : {
      main : "#thumbs"
    },

    ui : {
      banner : "#banner",
      row : ".banner-content"
    },

    events : {
      "click #createShred" : "__createShredBtnClicked"
    },

    serializeData : function() {
      return {
        user : Shredr.user.toJSON()
      };
    },

    onRender : function() {
      this.thumbCollectionView = new ThumbCollectionView({collection : new ShredsCollection()});
      this.main.show(this.thumbCollectionView);
      this.thumbCollectionView.on("thumb:pressed", $.proxy(this.changeMainSection, this, this.displayShred));
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
      this.main.show(createView);
    },

    displayShred : function(shred) {
      var shredView = new ShredView({model : shred});
      this.main.show(shredView);
    }
  });

  return StageView;
});