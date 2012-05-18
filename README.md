# Input jQuery Plugin

**input HTML5 event**  
This event is sent when a user enters text in a textbox.  
This event is only called when the text displayed would change, thus it is
not called when the user presses non-displayable keys.  
Source: https://developer.mozilla.org/en/XUL/Attribute/oninput

This plugin:

* provides feature detection via `$.support.input`
* provides a `.input()` shortcut for `.bind('input')` and `.trigger('input')`
* fixes IE 9-10 incomplete behavior
* polyfills IE 6-8

## Usage

Same as the other jQuery shortcuts such as `.keydown`, `.keypress`, etc.

```javascript
.input(callback); // Bind
.input(data, callback); // Bind
.input(); // Trigger
```

The fix and polyfill for IE are applied automatically.

## Browser Support

* Firefox 4+ (native)
* Chrome (native)
* Safari 4+ (native)
* Opera 10.5+ (native)
* IE 9-10 (native + fix)
* IE 6-8 (polyfill)

## Known Issues

* IE 9-10: Event fires twice on right click -> cut.

* IE 9-10: When pressing backspace/delete repeatedly (or keeping it pressed),
  an event might see values (`element.value`) one step in advance (thus firing
  twice with the same value, and skipping one step).  
  However, the final event is guaranteed to see the correct value.  
  Example: value is `Test`, keeping backspace pressed, the sequence of values
  might be: `Tes`, `T`, `T` and finally `(empty string)`.

* Opera 10.5 doesn't fire the event on cut, paste, undo, and drop.

## Notes

This plugin is currently for desktop browsers only.  
Contributions are welcome.

## License

Copyright (c) 2012 [Thibaut Courouble](http://thibaut.me)  
Licensed under the MIT License.
