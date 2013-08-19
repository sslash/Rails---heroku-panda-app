define([
// Vendor
'marionette',
'handlebars',
'bootstrap',
'underscore',

 // Models
 'models/shredder',
 'models/shred',

 // Collections
 'collections/shredders',

	// Templates
	'text!templates/shredder/shredder.hbs',
  'text!templates/shredder/shredders.hbs',
  'text!templates/shredder/sotw.hbs',
  'text!templates/shredder/shreddersTransitionTpl.hbs',


	// Plugins
	'session',
  'ajaxHelper'
  ], function (Marionette,Handlebars, bs, _, Shredder, Shred, Shredders,
    shredderTpl, shreddersTpl, sotwTpl, shreddersTransitionTpl, Session, Ah) {

   var ShredderView = {}

  // List of shredders View.
  ShredderView.ShreddersView = Marionette.Layout.extend({
    template: Handlebars.compile(shreddersTpl),
    page : 1,
    offset : 20,

    events : {
      "click #nextPage" : "fetchNextPage",
      "keypress .search-query" : "searchPressed"
    },

    initialize : function() {
      this.listenTo(this.collection, 'reset', this.render);
      this.collection.initURL({
        'page' : this.page,
        'offset' : this.offset
      });
    },

    searchPressed : function(e) {
      if ( e.keyCode == 13 ) {
        var q = $('.search-query').val();
        this.collection.search(q);
      }
    },

    fetchNextPage : function(event) {
      event.preventDefault();
      this.page ++;
      this.collection.initURL({
        'page' : this.page,
        'offset' : this.offset
      });

      this.collection.fetch({reset:true});
    },
  });


  ShredderView.Sotw = Marionette.ItemView.extend({
    template : Handlebars.compile(sotwTpl),
    model : Shredder,

    initialize : function(){
      this.listenTo(this.model, "change", this.modelChanged);
    },

    events: {
      'click a.sotwItem' : 'shredClicked',
    },

    shredClicked : function(e) {
      e.preventDefault();
      var index = e.currentTarget.id.split('-')[1];
      if ( index && this.model.get('shreds')[index]){
        var shred = new Shred(this.model.get('shreds')[index]);
        mainController.trigger("show:shredModal", shred);
      }
    },

    modelChanged : function() {
      this.render();
    }
  });


  ShredderView.ShreddersRow = Marionette.ItemView.extend({
    template: Handlebars.compile(shreddersTransitionTpl),
    collection : Shredders,

    initialize : function() {
      this.listenTo(this.collection, "reset", this.render);
    },

    events: {
      'click #' : 'shredClicked'
    },
  });


  ShredderView.ProfileView = Marionette.ItemView.extend({
    template : Handlebars.compile(shredderTpl),
    battleRelationshipDiv : "#battleRelationship",

    initialize : function() {
      this.model.initURL({
        withShreds : 20
      });

      this.setFaneeRelationship();
      this.gtrIndex = this.gearIndex = 0;
    },

    setFaneeRelationship : function() {
      var user = Session.getUser();
      var shredderId = this.model.get('id'); 
      this.fanees = false;
      this.isSelf = false;
      var that = this;
      if ( user.id == shredderId) {
        this.isSelf = true;
      } else {
        _.each(user.fanees, function(f){
          console.log("user.fan: " + f._id);
          if ( f._id == shredderId ){
            console.log("FANS");
            that.fanees = true;
          }
        });
      }
    },


    events : {
      'click a.pShreds' : 'shredClicked',
      'click #becomeFanBtn' : 'becomeFanClicked',
      'click #battleChallenge' : 'openChallengeModal',
      'submit #addShredForm' : 'challengeSubmitted',
      'click .leftGtr' : 'prevGtrClicked',
      'click .rightGtr' : 'nextGtrClicked',
      'click .leftGear' : 'prevGearClicked',
      'click .rightGear' : 'nextGearClicked',
    },

    prevGtrClicked : function(e) {
     e.preventDefault();
     var arr = this.model.get('guitars');
     this.gtrIndex -= 1;
     if ( this.gtrIndex === -1 ) this.gtrIndex = arr.length -1;
     $('#gtrModal img').attr('src', "uploads/" + arr[this.gtrIndex].file);     
   },

   nextGtrClicked : function(e) {
     e.preventDefault();
     var arr = this.model.get('guitars');
     this.gtrIndex = ++this.gtrIndex % arr.length;
     $('#gtrModal img').attr('src', "uploads/" + arr[this.gtrIndex].file);
   },
   
   prevGearClicked : function(e) {
     e.preventDefault();
     var arr = this.model.get('equiptment');
     this.gearIndex -= 1;
     if ( this.gearIndex === -1 ) this.gearIndex = arr.length -1;
     $('#gearModal img').attr('src', "uploads/" + arr[this.gearIndex].file);   
   },
   
   nextGearClicked : function(e) {
     e.preventDefault();
     var arr = this.model.get('equiptment');
     this.gearIndex = ++this.gearIndex % arr.length;
     $('#gearModal img').attr('src', "uploads/" + arr[this.gearIndex].file);
   },

   openChallengeModal : function() {
    mainController.trigger("battle:battleRequest:showModal", this.model);
  },

  challengeSubmitted : function(e){
    e.preventDefault();
    var file = $('#challengeFile')[0].files[0];
    var radio = $('input[name="optionsRadios"]:checked').val();
    var url = '/api/battleRequests/create/' + Session.getUser().id + 
    '/' + this.model.get('id') + '/?style='+radio;
    file = Ah.verifyVideo(file);
    var that = this;
    if ( file ) {
      Ah.uploadFile({
        file : file,
        handler : function(res){
          that.$('.challengeBox').html('');
          that.$('#challengeModal').modal('hide');
        },
        url : url
      });
    }
  },

  becomeFanClicked : function(e) {
    e.preventDefault();
    mainController.trigger('action:addFanee', this.model.toJSON());
  },

  shredClicked : function(e) {
    e.preventDefault();
    var index = e.currentTarget.id.split('-')[1];
    if ( index && this.model.get('shreds')[index]){
      var shred = new Shred(this.model.get('shreds')[index]);
      mainController.trigger("show:shredModal", shred);
    }
  },


  serializeData: function(){
    var data = this.model.toJSON();
    var b_len = data.battles.length > 4 ? 4 : data.battles.length;
    var s_len = data.shreds.length > 4 ? 4 : data.shreds.length;

    data.shreds = _.first(data.shreds, s_len);
    data.battles = this.serializeBattleData(_.first(data.battles, b_len));
    data.fanSize = data.fanees.length;
    data.fanees = this.fanees;
    data.isSelf = this.isSelf;

    return data;
  },

  serializeBattleData : function(battles) {
    var uid = Session.getUser().id;
    _.each(battles, function(b) {
      if (b.battler._id === uid){
        b.vsImg = b.battlee.profileImagePath;
        b.otherGuy = b.battlee;
      }
      else{
        b.otherGuy = b.battler;
      }
    });
    return battles;
  }
});

//   // Return the module for AMD compliance.
return ShredderView;

});
