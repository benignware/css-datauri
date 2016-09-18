css-datauri
===========

> Embed assets in css files

## Install

```cli
npm install css-datauri --save-dev
```


## Usage

#### Basic Example

Convert assets to data-urls in css-files

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

#### Custom Example

Filter assets by glob pattern relative to current working dir

##### Async

```js
var CSSDataURI = require('css-datauri');
(new CSSDataURI({
	filter: ['test/fixtures/fonts/**/*']
})).encode('test/fixtures/test.css', 'tmp/custom_options', (err, data) => {
	// Done
});
```

##### Sync
```js
var cssDataURISync = require('css-datauri').sync;
cssDataURISync('test/fixtures/test.css', 'tmp/custom_options', {
	filter: ['test/fixtures/fonts/**/*']
});
```


##  Options

#### options.filter
Type: `Array`
Default value: `['**/*']`

Filter assets by glob pattern relative to current working dir
