/*
 * Input jQuery Plugin v0.1
 *
 * Copyright (c) 2012 Thibaut Courouble
 * http://thibaut.me
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

/*
 * State of the HTML5 "input" event:
 *
 * - Firefox 9+ YES
 * - Firefox 4 through 8 YES BUT feature detection via setAttribute
 *   (a newly created input element doesn't have the oninput property)
 * - Firefox 2 through 3.6 YES BUT feature detection is a mess
 *   (must fire the event on a test input)
 *
 * - Chrome YES
 *
 * - Safari 4+ YES
 *   (some people claim the event doesn't work on textareas with Safari 4;
 *   it worked for me with Safari 4.0.5 Mac & PC tested via BrowserStack)
 *
 * - Opera 11+ YES
 * - Opera 10.5 YES BUT doesn't fire on cut, paste, undo, and drop
 *
 * - IE 9-10 YES BUT doesn't fire on backspace, cut, and delete
 * - IE 6-8 NO; fires the "propertychange" event instead (doesn't bubble)
 *
 * What this plugin does:
 *
 * - Feature detection via $.support.input
 * - Provide a .input() shortcut for .bind('input') and .trigger('input')
 * - Fix IE 9-10
 * - Polyfill IE 6-8
 *
 * I gave up on fixing Opera 10.5 and feature detection in FF 2-3.
 *
 * Known issues:
 *
 * - IE 9-10: Event firing twice on right click -> cut
 *
 * - IE 9-10: When pressing backspace/delete repeatedly (or keeping it pressed),
 *   an event might see values (element.value) one step in advance (thus firing
 *   twice with the same value, and skipping one step).
 *   However, the final event is guaranteed to see the correct value.
 *
 *   Example: value is "Test", keeping backspace pressed, the sequence of values
 *   might be: "Tes", "T", "T", and finally, "" (empty string).
 *
 * Note: this plugin is currently for desktop browsers only.
 *
 * This post by Daniel Friesen greatly helped with the development of this plugin:
 * http://blog.danielfriesen.name/2010/02/16/html5-browser-maze-oninput-support/
 */

(function(document, $, undefined) {
  'use strict';

  $.support.input = (function() {
    var input = document.createElement('input');

    if ('oninput' in input)
      return true;

    input.setAttribute('oninput', 'return;');

    if (typeof input.oninput === 'function')
      return true;

    return false;
  })();

  $.fn.input = function(data, fn) {
    if (fn === undefined) {
      fn = data;
      data = null;
    }

    return arguments.length > 0 ? this.on('input', null, data, fn) : this.trigger('input');
  };

  function fixIE() {
    function triggerInput(element) {
      setTimeout(function() {
        $(element).trigger('input');
      }, 1);
    }

    function triggerInputLengthCheck(element) {
      var length = element.value.length;

      setTimeout(function() {
        if (element.value.length < length)
          $(element).trigger('input');
      }, 1);
    }

    $(document)
      // Backspace/delete
      .on('keydown', 'input, textarea', function(event) {
        if (!event.isDefaultPrevented() && (event.which === 8 || event.which === 46) && !event.ctrlKey)
          triggerInputLengthCheck(this);
      })
      // Cut
      .on('cut', 'input, textarea', function(event) {
        if (!event.isDefaultPrevented())
          triggerInput(this);
      })
      // Right click -> delete
      .on('mouseup', 'input, textarea', function(event) {
        if (event.which === 3)
          triggerInputLengthCheck(this);
      });
  }

  function polyfillIE() {
    function triggerInput() {
      $(this).trigger('input');
    }

    function bindPropertyChange() {
      $(this).off('propertychange').on('propertychange', triggerInput);
    }

    function unbindPropertyChange() {
      $(this).off('propertychange');
    }

    $(document.body) // the drop event doesn't bubble up to the document
      .on('focus drop', 'input, textarea', bindPropertyChange)
      .on('blur', 'input, textarea', unbindPropertyChange);

    if (document.activeElement)
      bindPropertyChange.call(document.activeElement);
  }

  $(function() {
    if ($.browser.msie) {
      if ($.support.input) fixIE();
      else polyfillIE();
    }
  });
})(document, jQuery);
