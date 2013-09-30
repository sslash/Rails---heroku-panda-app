define([
  'marionette',
  'handlebars',
  'bootstrap',

  'text!templates/battle.hbs',
  'popcorn'
  ], function (Marionette, Handlebars,bs, tpl) {

    BattleView = Backbone.Marionette.ItemView.extend({
      template: Handlebars.compile(tpl),

      ui : {
        audio : '#audioFile',
        tab : "#tab-input"
      },

      mediaTags : [
        'audioFile',
        'leftVideoFile1',
        'rightVideoFile1',
        'leftVideoFile2',
        'rightVideoFile2',
        'leftVideoFile3',
        'rightVideoFile3'
      ],

      visitObj : {
        waitTime : 0,
        thisObj : {}
      },

      initialize : function(){
        if (window.options){
          this.shred = window.options.shred;
        }
      },

      onDomRefresh : function() {
        this.drawTabs();
        //this.startTabRuler();
        this.startBarrier();
      },

      startBarrier : function() {
        console.log("starting barriesr");
        var that = this;
        this.med1 = document.getElementById(this.mediaTags[0]);
        this.med2 = document.getElementById(this.mediaTags[1]);
        this.med3 = document.getElementById(this.mediaTags[2]);

        this.med1.addEventListener("canplay", function(e){
         that.tryPlay(e);
        });

        this.med2.addEventListener("canplay", function(e){
           that.tryPlay(e);
        });

        this.med3.addEventListener("canplay", function(e){
           that.tryPlay(e);
        });

      },

      tryPlay : function(e) {
        console.log("try play: " + e.currentTarget);
        if ( (this.med1.readyState === 4) &&
          (this.med2.readyState === 4) &&
          (this.med3.readyState === 4)){
          this.playBattle();
        }
      },

      playBattle : function() {
        this.startTabRuler();
        console.log("starting battle");
        var visitObjs = [
        {
          pre : function(){},
          waitTime : 1150,
          thisObj : this.ui.audio[0]
        },
        {
          pre : function(){},
          waitTime : 0,
          thisObj : Popcorn('#leftVideoFile1')
        },
        {
          pre : function(){},
          waitTime : 5450,
          thisObj : Popcorn('#rightVideoFile1')
        },
        {
          pre : this.toggle,
          hideTag : "#leftVideoFile1",
          showTag : '#leftVideoFile2',
          waitTime : 10550,
          thisObj : Popcorn('#leftVideoFile2')
        },
        {
          pre : this.toggle,
          hideTag : "#rightVideoFile1",
          showTag : '#rightVideoFile2',
          waitTime : 22350,
          thisObj : Popcorn('#rightVideoFile2')
        },
        {
          pre : this.toggle,
          hideTag : "#leftVideoFile2",
          showTag : '#leftVideoFile3',
          waitTime : 34500,
          thisObj : Popcorn('#leftVideoFile3')
        },
        {
          pre : this.toggle,
          hideTag : "#rightVideoFile2",
          showTag : '#rightVideoFile3',
          waitTime : 39900,
          thisObj : Popcorn('#rightVideoFile3')
        }];

        for ( var i = 0; i < visitObjs.length; i ++) {
          this.waitAndExec(visitObjs[i]);
          this.waitAndPlay(visitObjs[i]);
        }
      },

      toggle : function(show, hide) {
        $(hide).hide();
        $(show).show();
      },

      play : function(tagAdd, tagRm, src) {
        this.waitAndPlay(0, tagAdd);
      },

      waitAndExec : function(visitObj){
        setTimeout(function() {
          visitObj.pre(visitObj.showTag, visitObj.hideTag);
        },visitObj.waitTime - 500);
      },

      waitAndPlay : function(visitObj) {
        setTimeout(function() {
          visitObj.thisObj.play();
        },visitObj.waitTime);
      },

      startTabRuler : function() {
        var tempo = this.shred.tabs.tempo;
        var bts_sec = tempo / 60; // beveg deg bts_sec firedels noter i sekundet
        var draws_sec = bts_sec * (1*4); // 1/4 noter i sekundet * 16 = 1/64
        var miliseconds_until_next_draw = 1000/draws_sec;

        this.firstRest = this.shred.tabs.tempo * 2;
        var widthInterval = 1148 / (4*16); // bredde per bevegelse. vet ikke hvorfor 1140 gir riktig bredde
        this.currWidthInterval = this.tabswidth / (firstRest*4) - 5;
        var that = this;

        this.antallRulerMvmnts = 4*16;
        setInterval(function(){
          antallRulerMvmnts --;
          if (antallRulerMvmnts == 0) {
            that.redrawTabs();            
          }
          that.drawRuler(that.currWidthInterval);
          that.currWidthInterval += widthInterval;
        }, miliseconds_until_next_draw);
      },

      redrawTabs : function() {
        this.currWidthInterval = this.tabswidth / (this.firstRest*4) - 5;
        $('.note').remove();
        this.drawBackground();
        this.antallRulerMvmnts = 4*16;
      },


      /**************************************************************
      *                         CREATE TABS                         *
      ***************************************************************/
      drawTabs : function() {
        this.drawBackground();
      },

      drawBackground : function(){
        if ( !this.barsIndex ){
          this.barsIndex = 0;
        }
        if (!this.shred.tabs) {
          return false;
        }

        //this.prevBarsIndex = this.barsIndex;
        var prevLeft = 0;
        var that = this;
        this.tabswidth = 1370; //$('#bars').width(); TODO: SHOULD BE THIS
        var tabs = this.shred.tabs.tabs;
        var prevRest = tabs[0].rest * 2; // Start from 32 px left margin

        for (var barsCounter = 0; (this.barsIndex < tabs.length && barsCounter < 4); this.barsIndex ++ ){
          var tab = tabs[this.barsIndex];
          barsCounter += 1/tab.rest;

          prevLeft = Math.round(( this.tabswidth / (prevRest*4)) + prevLeft);
          prevRest = tab.rest;

          _.each(tab.stringz, function(obj) {
            var le_string = Object.keys(obj)[0];
            var label = $("<label class='note' title='" +tab.rest + "'>" + obj[le_string] + "</label>");
            label.css('left', (prevLeft + "px") );

            // first 25 = top offset. Multiplier 25 = offset between lines
            var top = 32 + (le_string*27);
            label.css('top', (top + "px") );

            that.ui.tab.append(label);
          });             
        }
      },

      drawRuler : function(nextWidth){
        var ruler=document.getElementById("bars");
        ruler.width  = 1370;
        this.rulerHeight = 126; 
        this.currRulerX = 0;
        
        this.ctx = ruler.getContext("2d");
        this.ctx.clearRect(0, 0, ruler.width, ruler.height);
        this.ctx.strokeStyle='#cc0000';
        this.ctx.lineWidth = 2;


        this.ctx.beginPath();
        this.ctx.moveTo(nextWidth,0);
        this.ctx.lineTo(nextWidth,this.rulerHeight);
        this.ctx.stroke();
      }

    });

    return BattleView;
});

