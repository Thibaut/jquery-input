$(function() {
  module('$.fn.input');

  asyncTest('Trigger', 1, function() {
    $('#input')
      .on('input', function() { ok(true); start(); })
      .input();
  });

  asyncTest('Bind', 1, function() {
    $('#input')
      .input(function() { ok(true); start(); })
      .trigger('input');
  });

  if ($.browser.msie) {

    var version = parseInt($.browser.version, 10);

    module('IE' + version);

    if (version >= 9) { // IE 9-10

      var deleteKeys = { 'Backspace': 8, 'Delete': 46 };

      test('$.support.input', function() {
        ok($.support.input, '$.support.input: ' + $.support.input + ' (expected: true)');
      });

      for (var key in deleteKeys) {

        asyncTest(key, function() {
          $('#input')
            .val('Test')
            .input(function() { ok(true); start(); })
            .trigger($.Event('keydown', { which: deleteKeys[key] }))
            .val('');
        });

        asyncTest(key + ' when value unchanged', 0, function() {
          $('#input')
            .val('Test')
            .input(function() { ok(false); })
            .trigger($.Event('keydown', { which: deleteKeys[key] }));
          setTimeout(function() { start(); }, 50);
        });

        asyncTest(key + ' when empty', 0, function() {
          $('#input')
            .val('')
            .input(function() { ok(false); })
            .trigger($.Event('keydown', { which: deleteKeys[key] }));
          setTimeout(function() { start(); }, 50);
        });

        asyncTest(key + ' default prevented', 0, function() {
          $('#input')
            .val('Test')
            .input(function() { ok(false); })
            .keydown(function(e) { e.preventDefault(); })
            .trigger($.Event('keydown', { which: deleteKeys[key] }))
            .val('');
          setTimeout(function() { start(); }, 50);
        });

        asyncTest(key + ' with ctrl key', 0, function() {
          $('#input')
            .val('Test')
            .input(function() { ok(false); })
            .trigger($.Event('keydown', { which: deleteKeys[key], ctrlKey: true }))
            .val('');
          setTimeout(function() { start(); }, 50);
        });

      }

      asyncTest('Cut', function() {
        $('#input')
          .val('Test')
          .input(function() { ok(true); start(); })
          .trigger('cut');
      });

      asyncTest('Cut default prevented', 0, function() {
        $('#input')
          .val('Test')
          .input(function() { ok(false); start(); })
          .on('cut', function(e) { e.preventDefault(); })
          .trigger('cut');
        setTimeout(function() { start(); }, 50);
      });

      asyncTest('Right click -> length decrease (cut or delete)', function() {
        $('#input')
          .val('Test')
          .input(function() { ok(true); start(); })
          .trigger($.Event('mouseup', { which: 3 }))
          .val('Tes');
      });

      asyncTest('Right click -> nothing', 0, function() {
        $('#input')
          .val('Test')
          .input(function() { ok(false); start(); })
          .trigger($.Event('mouseup', { which: 3 }));
        setTimeout(function() { start(); }, 50);
      });

      asyncTest('Right click -> length increase (paste)', 0, function() {
        $('#input')
          .val('Test')
          .input(function() { ok(false); start(); })
          .trigger($.Event('mouseup', { which: 3 }))
          .val('Testing');
        setTimeout(function() { start(); }, 50);
      });

    } else { // IE 6-8

      test('$.support.input', function() {
        ok(!$.support.input, '$.support.input: ' + $.support.input + ' (expected: false)');
      });

      asyncTest('propertychange', function() {
        $('#input')
          .trigger('focus')
          .input(function() { ok(true); start(); })
          .trigger('propertychange');
      });

    }

  }

});
