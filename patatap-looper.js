(function(exports) {
  var SL = {
    beatsPerLoop: 16,
    beatsPerMinute: 200,
    _loops: {},
    _stop: false,

    add: function(name, beats) {
      this._loops[name] = beats.split(' ');
      return this;
    },

    remove: function(name) {
      delete this._loops[name];
    },

    list: function() {
      var count = 0;
      for (var key in this._loops) {
        console.log(key + ': ' + this._loops[key].join(' '));
        count++;
      }
      console.log(count + ' loop(s)');
    },

    clear: function() {
      this._loops = {};
    },

    stop: function() {
      this._stop = true;
    },

    start: function() {
      this._stop = false;
      superloop(0, this.beatsPerLoop, this.beatsPerMinute);
    }
  };

  /**
   * Plays the character at the specified beat in a loop array.
   * This version uses plain JavaScript instead of jQuery.
   */
  function playBeat(loop, beat) {
    var character = loop[beat];
    if (character && character !== '-') {
      // Convert the character to upper case and get its char code.
      var keyChar = character.toUpperCase();
      var keyCode = keyChar.charCodeAt(0);

      // Try to fire a keydown event in plain JS:
      try {
        var event = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: keyChar,
          code: 'Key' + keyChar,
          which: keyCode,
          keyCode: keyCode
        });
        
        // Update the first <input> we find in the DOM (if any).
        var input = document.querySelector('input');
        if (input) {
          input.value = keyChar;
        }
        
        // Dispatch the event on <html> (document.documentElement).
        document.documentElement.dispatchEvent(event);
      } catch(error) {
        console.warn('Typo at beat ' + beat);
      }
    }
  }

  /**
   * The main loop function, called recursively.
   */
  function superloop(beat, bpl, bpm) {
    // Loop over each named loop in SL._loops and play the current beat.
    Object.keys(SL._loops).forEach(function(key) {
      var loop = SL._loops[key];
      playBeat(loop, beat);
    });

    if (SL._stop) return;

    setTimeout(function() {
      var nextBeat = (beat + 1) % bpl;
      superloop(nextBeat, bpl, bpm);
    }, (1000 * 60) / bpm);
  }

  // Start immediately by default.
  superloop(0, SL.beatsPerLoop, SL.beatsPerMinute);

  // Expose the superloops object so we can call `superloops.add(...)`, etc.
  exports.superloops = SL;

  // Clear the console (optional).
  console.clear();

})(window);

// EXAMPLE USAGE:
superloops
  .add('base',  'e - - - e - - - e - - - e - - -')
  .add('snare', '- - o - - - o - - - o - - - o -')
  .add('love',  '- p - h - e - a - r - t - m - -');
