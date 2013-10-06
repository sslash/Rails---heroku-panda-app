define([
  'marionette',
  'handlebars',
  'bootstrap',

  // Templates
  'text!templates/stage/shredThumb.hbs'
  ],function (Marionette, Handlebars, bs, tpl) {

  ThumbItemView = Backbone.Marionette.ItemView.extend ({
    template : Handlebars.compile(tpl),
    tagName: "div",
    className: "shredThumb",

    ui : {
      shredderPopover : ".shrdr-popover"
    },

    events : {
      "click img" : "__thumbClicked",
      "mouseover a.shrdr-name" : "__shredderNameHovered"
    },

    __thumbClicked : function() {
      this.trigger("thumb:pressed");
    },

    __shredderNameHovered : function(e) {
      e.preventDefault();
      this.ui.shredderPopover.show();
    }

  });

  return ThumbItemView;
});