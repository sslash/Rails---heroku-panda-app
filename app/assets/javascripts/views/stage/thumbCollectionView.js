define([
  'marionette',
  'views/stage/thumbItemView'
  ],function (Marionette, ThumbItemView) {

  ThumbCollectionView = Backbone.Marionette.CollectionView.extend ({
    itemView : ThumbItemView,

    initialize : function() {
      this.collection.fetch({reset : true});
      this.collection.on('reset', this.render);
      this.on("itemview:thumb:pressed", this.thumbItemClicked);
    },

    thumbItemClicked : function(thumb) {
      this.trigger("thumb:pressed", thumb.model);
    }


  });

  return ThumbCollectionView;
});