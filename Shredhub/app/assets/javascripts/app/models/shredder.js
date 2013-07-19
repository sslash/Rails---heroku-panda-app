 define([
  'backbone',
 	'session'
 ],
function(Backbone, Session) {

	var Shredder = Backbone.Model.extend({
    urlRoot : '/api/shredders',

    shredderLvlLabels : ["Beginner", "Skilled", "Awesome", "Shred king", "Wizard"],

    defaults : {
      levelLabel : "Beginner",
      shredderLevel : 0
    },

    initialize : function() {
      this.listenTo(this, "fetch:sotw", this.fetch);
      if ( !this.get('id') ){
          this.url = this.urlRoot + '/?page=1&offset=1'
        }
    },

    initURL : function(args) {
      if ( args.withShreds ) {
        this.withShreds = args.withShreds;
      }

      if ( args.url ) {
        this.url = args.url;
      }
    },

    parse : function(response, options){
      if (response instanceof Array) {
          response = response[0]; 
      }

      if ( response.shredder ) {
        shreds = response.shreds;
        battles = response.battles;
        response = response.shredder;
        response.shreds = shreds;
        response.battles = battles;
      }

      // Set the new shredder label
      response.levelLabel = this.getLevelLabel(response.shredderLevel);
      return response;
    },

    getLevelLabel : function(currLvl) {
      //if ( currLvl > 0 ) currLvl = currLvl/100;
      if (  currLvl < 20 ) {
        return this.shredderLvlLabels[0];
      } else if (  currLvl < 40 ) {
        return this.shredderLvlLabels[1];
      } else if (  currLvl < 60 ) {
        return this.shredderLvlLabels[2];
      } else if (  currLvl < 80 ) {
        return this.shredderLvlLabels[3];
      }else {
        return this.shredderLvlLabels[4];
      }
    },

    increaseShredderLevel : function(level) {
      var that = this;
      // No need to check rate value. It's already been veryfied

      $.ajax(this.urlRoot + "/" + this.get('_id'),
      { 
       
        data : { shredderLevel : level },
        type : "PUT"
      })
      .done(function(res){
        that.set(res);
        that.trigger('shredderUpdated');
      });
      return true;
    },

    /*
    * Given a shredder and a list of battles; checks if they are in a battle
    */
    getIfWeAreInBattleTogether : function (shredderId, listOfBattles){
      if ( listOfBattles) {
        for ( var i = 0; i < listOfBattles.length; i++) {
          if ( this.checkIfInBattle(shredderId, listOfBattles[i])){
            return listOfBattles[i]._id;
          }
        }
      }
      return null;
    },

    checkIfInBattle : function(shredderId, b){
      if (this.checkIfIsBattleeInBr(shredderId, b))
        return true;
      else if (this.checkIfIsBattlerInBr(shredderId, b) )
        return true;
      else
        return false;
    },

    getIfIHaveSentYouABR : function(shredderId, listOfBrs){
      if ( listOfBrs) {
        for ( var i = 0; i < listOfBrs.length; i++) {
          if ( this.checkIfIsBattlerInBr(shredderId, listOfBrs[i])){
            return listOfBrs[i];
          }
        }
      }
      return null;
    },

    checkIfIsBattlerInBr : function(shredderId, b){
      return b.battlee._id == shredderId && b.battler._id == this.get('_id');
    },

    getIfYouHaveSentMeABR : function(shredderId, listOfBrs){
      if ( listOfBrs){
        for ( var i = 0; i <listOfBrs.length; i++) {
          if ( this.checkIfIsBattleeInBr(shredderId, listOfBrs[i])){
            return listOfBrs[i]._id;
          }
        }
      }
      return null;
    },

    checkIfIsBattleeInBr : function(shredderId, b){
      return b.battler._id == shredderId && b.battlee._id == this.get('_id');
    }

  });

 return Shredder;
});