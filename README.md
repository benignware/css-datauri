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

##### Events

```js
var CSSDataURI = require('css-datauri');
(new CSSDataURI())
	.on('success', (content) => {
		// Done
	})
	.on('error', err => { throw(err); })
	.encode('test/fixtures/test.css', 'tmp/default_options');
```

##### Promise

```js
var cssDataURIPromise = require('../lib/css-datauri').promise;
cssDataURIPromise('test/fixtures/test.css', 'tmp/default_options')
	.then((content) => {
		// Done
	}).catch(err => { throw(err); });

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
