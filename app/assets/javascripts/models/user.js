// User module
define([
  'session',
  'ajaxHelper',
  'collections/battleRequests',
  ],

  function(Session, Ah, BattleRequests) {
  // This represents an authenticated User!
  var User = Backbone.Model.extend({
    urlRoot : '/api/shredders',

    xpsInLvl : 20000, 
    shreddrLvlLabels : {
    "Shred Youngster" : 1,
    "Shred Junior" : 2,
    "Shreddr" : 3,
    "Shradawan" : 5,
    "Shredi": 8,
    "Shrizard" : 21,
    "Shred Knight" : 34,
    "Shred King" : 55
    //"God" : 89    
    },

    initUser : function(jsonData){
      Session.setUser(jsonData);
      this.resetUser();
    },

    resetUser : function(){
      var that = this;
      this.fetchBattleRequests()
      .done(function(battleRequestCollection){
        Session.setIncomingBattleRequests(battleRequestCollection);          
        that.populateSessionData();
      })
      .done(function(){
        mainController.trigger("sessionDataFetched");                    
      });
    },

    addFaneeRelationship : function(fanee) {
    // Check if they are friends already
    delete fanee['shreds'];
    var that = this;
    Ah.post({
      url : "/api/shredders/" +fanee.id + "/addFanee/",
      data : fanee,
      handler : function(res){
        that.updateSessionAddFanee(res);
      }
    });
  },

  updateSessionAddFanee : function(fanee) {
    var user = Session.getUser();
    user.fanees.push(fanee);
    Session.setUser(user);
    mainController.trigger("action:updateNavBar");
  },

  /*
  * Fetches necessary data like battles and sentout battlerequests
  */
  populateSessionData : function(){
    var dfr = $.Deferred();
    Ah.get({
      url : '/api/battleRequests/sent/' + Session.getUser().id
    })
    .done(function(res){
      Session.setSentBattleRequests(res);
      console.log("fetched breqs");
      return this;
    })
    .done(function(){
      return Ah.get({
        url : '/api/battles/shredder/' + Session.getUser().id
      })
    })     
    .done(function(res){
        Session.setBattles(res);
        console.log("fetched battles");
    });

    return dfr.promise();


    //var dfr = $.Deferred();
    // // Fetch battle requests sent out
    // $.ajax('/api/battleRequests/sent/' + Session.getUser().id,
    // {
    //   beforeSend: function ( xhr ) {
    //     xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
    //   },
    //   success : function(res) {
    //     Session.setSentBattleRequests(res);
    // }})
    // .done(function(){

    // // // Fetch battles
    //  $.ajax( '/api/battles/shredder/' + Session.getUser().id,
    //  {
    //   beforeSend: function ( xhr ) {
    //     xhr.setRequestHeader("X-CSRF-Token", $('meta[name=csrf-token]').attr('content'));
    //   },
    //   success : function(res) {
    //     Session.setBattles(res);
    //   }});
    // })
    // .done(function(){
    //    dfr.resolve();
    // });
    // return dfr.promise();
  },

  doLogOut : function() {
    var that = this;
    $.post('/sessions/logout')
    .done( function() {
      Session.clear(); 
      mainController.trigger("auth:logout:success");
      router.navigate("/", {trigger : true});
    })
    .fail( function() { console.log("logout fail");});
  },

  fetchBattleRequests : function() {
    var dfr = $.Deferred();

    var battleCollection = new BattleRequests();
    battleCollection.setShredderId(Session.getUser().id);

    battleCollection.fetch({
      success : function(res) { 
        dfr.resolve(battleCollection);
      }
    });      

    return dfr.promise();
  },

  // TODO: Unit test..
  /*
  * This function assumes this model has been refreshed,
  * but the Session data has not been reset yet (happens at the end)
  */
    checkIfNewLevelReached : function() {

      // Session object has not been refreshed yet
      var oldXp = Session.getUser().xp;
      var newXp = this.get('xp');

      var oldLevel = Math.floor(oldXp / this.xpsInLvl);
      var newLevel = Math.floor(newXp / this.xpsInLvl);
      var toReturn = {}

      // Check of we have reached a new level
      if ((newXp % this.xpsInLvl === 0 ) ||
        (oldLevel < newLevel)) {
          // new level == true
          toReturn['newLevel'] = newLevel;

          // Check if the new level is within a new badge
          if (oldLevel === (this.shreddrLvlLabels["Shred Youngster"] - 1) ){
            toReturn['newLevelLabel'] = "Shred Youngster";
          } else if (oldLevel === (this.shreddrLvlLabels["Shred Junior"] - 1) ){
            toReturn['newLevelLabel'] = "Shred Junior";
          } else if (oldLevel === (this.shreddrLvlLabels["Shreddr"] - 1) ){
            toReturn['newLevelLabel'] = "Shreddr";
          } else if (oldLevel === (this.shreddrLvlLabels["Shradawan"] - 1) ){
            toReturn['newLevelLabel'] = "Shradawan";
          } else if (oldLevel === (this.shreddrLvlLabels["Shredi"] - 1) ){
            toReturn['newLevelLabel'] = "Shredi";
          } else if (oldLevel === (this.shreddrLvlLabels["Shrizard"] - 1) ){
            toReturn['newLevelLabel'] = "Shrizard";
          } else if (oldLevel === (this.shreddrLvlLabels["Shred Knight"] - 1) ){
            toReturn['newLevelLabel'] = "Shred Knight";
          } else if (oldLevel === (this.shreddrLvlLabels["Shred King"] - 1) ){
            toReturn['newLevelLabel'] = "Shred King";
          }
      }

      // Finally, update the session
      Session.setUser(this.attributes);
      return toReturn;
    }

  });

  // Return the module for AMD compliance.
  return User;
});
