 define([
  'underscore',
  'jquery'
  ],
  function(_,$) {

	var TabGenerator = function(options) {
		
		this.init = function(){
			this.tabInput = this.find("input");
			if (!this.tabInput){
				throw "Could not find tab input";
			}

			this.notes = that.options.notes || $('.notes');			
			this.tabs = [];
			this.tabsIndex = 0;			/* current Y */
			this.tabsStringIndex = 0;	/* current string */
			this.intervall = 4;			/* current rest */
			this.bars = 0; 				/* current bar / space */
			this.stringzHeight = "22px";/* Height between strings */
			this.noteDiv = "#crotchet";	/* Current interval image */

			this.tabInput.on('keyup', $.proxy(that.__keypressed, that));
			this.notes.on('click', $.proxy(that.__noteChangeClicked, that));
		};

		this.getTabInput = function() {
			return this.tabInput.val();
		};

		this.getTabs = function() {
			return {
				tempo: "125",
				tabs: this.tabs
			}
			
		};

		this.getNextMoveWidth = function() {
			return this.width() / (this.intervall*4);
		};

		this.createNoteObject = function(fret,tabsIndex,tabsStringIndex) {
			var parsedFret = parseInt(fret, 10);
			parsedFret = isNaN(parsedFret) ? -1 : parsedFret;

			if ( !this.tabs[tabsIndex] ){
				this.tabs[tabsIndex] = {};
			}

			this.tabs[tabsIndex].rest = this.intervall;
			if (!this.tabs[tabsIndex].stringz) {
				this.tabs[tabsIndex].stringz = []
			}

			// add the fret at the given string
			var obj = {}
			obj[tabsStringIndex] = parsedFret
			this.tabs[tabsIndex].stringz.push(obj);
			return parsedFret;
		};

		this.moveBarForward = function() {
			fret = this.getTabInput();
			fret = this.createNoteObject(fret, this.tabsIndex, this.tabsStringIndex);
			this.tabsIndex ++;
			this.bars += 1/this.intervall;

			// at the end
			if ( this.bars !== 4){ 
				var intervallWidthPx = this.getNextMoveWidth();
				this.tabInput.animate({ left: "+=" + intervallWidthPx + "px"}, 1);
			}
			return fret;
		};

		this.moveBarBackwards = function(){
			var intervallWidthPx = this.getNextMoveWidth();
			this.tabInput.animate({ left: "-=" + intervallWidthPx + "px"}, 1);
			this.tabsIndex --;
			this.bars -= 1/this.intervall;
			return
		};

		this.moveBarDownOrUpwards = function(dir) {
			var fret = this.getTabInput();
			if ( !isNaN (parseInt(fret, 10)) ){
				this.createNoteObject(fret, this.tabsIndex, this.tabsStringIndex);
			}
			if (dir === 'up'){
				this.tabInput.animate({ top: "-=" + this.stringzHeight}, 1);
				this.tabsStringIndex --;
			} else {
				this.tabInput.animate({ top: "+=" + this.stringzHeight}, 1);
				this.tabsStringIndex ++;
			}
			return fret;
		},
		
		this.__keypressed = function(e) {
			var key = e.keyCode;
			var fret = "";
			switch(key){
				case 13: // enter
					fret = this.moveBarForward();
					break;

				case 39: // right
					fret = this.moveBarForward();
					break;

				case 37: // left
					this.moveBarBackwards();
					break;

				case 38: // up
					fret = this.moveBarDownOrUpwards('up');
					break;

				case 40: // down
					fret = this.moveBarDownOrUpwards('down');
					break;
				default:
					return;
			}
			if ( fret === -1) {
				fret = "<img src='/assets/icons/notes/hvilepause.png'>"
			}

			var label = $("<label class='note'>" + fret + "</label>");
			label.offset(this.tabInput.position());
			this.tabInput.after(label);
			this.tabInput.val("");

			if ( this.bars === 4 ) {
				this.clearAndIterateBars();				
			}
		};

		this.__noteChangeClicked = function(e) {
			var divId = e.currentTarget.id;
			switch (true) {
				case /^semibreve$/.test(divId):
					this.intervall = 1;
					break;
				case /^minim$/.test(divId):
					this.intervall = 2;
					break;
				case /^crotchet$/.test(divId):
					this.intervall = 4;
					break;
				case /^quaver$/.test(divId):
					this.intervall = 8;
					break;
				case /^semiquaver$/.test(divId):
					this.intervall = 16;
					break;
				case /^demisemiquaver$/.test(divId):
					this.intervall = 32;
					break;
				case /^hemidemisemiquaver$/.test(divId):
					this.intervall = 64;
					break;
			}
			$(this.noteDiv).removeClass("selected");
			this.noteDiv = "#" + divId;
			$(this.noteDiv).addClass("selected");
		};

		this.clearAndIterateBars = function() {
			$('.note').remove();
			this.painTabInputField();
			this.bars = 0;
		};

		this.painTabInputField = function() {
			var intervallWidthPx = this.getNextMoveWidth();
			// Set tab-input start location
			this.tabInput.css("left", ((intervallWidthPx / 2) + "px"));
		};

		var that = this;
		this.options = options;
		this.init();
		return this;
	}


	$.fn.tabGenerator = TabGenerator;

    return $;
});
