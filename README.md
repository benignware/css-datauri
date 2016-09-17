css-datauri
===========

> Embed assets in css files

## Install

```cli
npm install css-datauri --save-dev
```


## Usage

#### Default Options

##### Async

```js
var CSSDataURI = require('css-datauri');
(new CSSDataURI()).encode('test/fixtures/test.css', 'tmp/default_options', (err, data) => {
	// Done
});
```

##### Sync
```js
var cssDataURISync = require('css-datauri').sync;
cssDataURISync('test/fixtures/test.css', 'tmp/default_options');
```

#### Custom Options

##### Async

```js
var CSSDataURI = require('css-datauri');
(new CSSDataURI({
	filter: ['**/*', '!**/*.png']
})).encode('test/fixtures/test.css', 'tmp/custom_options', (err, data) => {
	// Done
});
```

##### Sync
```js
var cssDataURISync = require('css-datauri').sync;
cssDataURISync('test/fixtures/test.css', 'tmp/custom_options', {
	filter: ['**/*', '!**/*.png']
});
```


## Options

#### options.filter
Type: `Array`
Default value: `['**/*']`

In- or exclude assets by providing an array containing glob patterns
