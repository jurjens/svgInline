# SVG Inline

A simple script to replace SVG <img> elements with inline SVG objects, to be able
to control SVG elements with CSS or Javascript.

## Install

Download either `src/svgInline.js` or `dist/svgInline.min.js`, or use bower;

```
bower install -S svgInline
```

Requires jQuery

## Usage

### Basic

Instantiate a new `SVGInline` instance and pass a jQuery object to the `replace()` function;

```
var svgInline = new SVGInline();
svgInline.replace( $('img.svg') );
```

### Observe changes

Just pass a `selectorString` to the observe function, whenever an element is added to the DOM that matches that
selector, it will get replaced automatically;

```
var svgInline = new SVGInline();
svgInline.observe('img.svg');
```

## Internal cache 

Use `<img>` tags and point the `src` or `inline-src` attribute to the SVG file you want to load inline. When using
the normal `src` attribute, the file be loaded 2 times; once by the browser, once by svgInline to fetch the svg data.
You can prevent an image from loading twice by using the `inline-src` attribute instead, but some browsers may not 
support this.

Either way, image data will be cached. So if you use for example an icon multiple times on the same page, it you don't
have to worry about an overload of requests.

```
This image will be downloaded twice;
<img src="my/image.svg">

This image will only be downloaded once;
<img inline-src="another/image.svg">

Even if we use it again (loads from cache);
<img inline-src="another/image.svg">
``` 

## Changelog

### v0.2.0
- Added `svgInline.observe()` to handle dynamically added DOM elements

## License

CC0 1.0 Universal (CC0 1.0) - https://creativecommons.org/publicdomain/zero/1.0/

This means you can do with it whatever you want.