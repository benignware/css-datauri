# css-datauri

> Embed assets in css files

## Install

```cli
npm install css-datauri --save-dev
```


## Usage

### Basic Example

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

### Custom Example

Filter assets by glob pattern

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


### CLI

Install `css-datauri` globally:
```
npm install css-datauri -g
```

Run `--help` to show usage information:

```cli
Usage: css-datauri [options] <src> <dest>

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -f, --filter [name]  Filter assets by glob pattern
    -b, --base [name]    Set path to asset directory
```


##  Options

#### options.filter
Type: `Array`
Default value: `['**/*']`

Filter assets by glob pattern

#### options.base
Type: `String`
Default value: `auto`

Set path to asset directory. If not specified, it's determined from source file.
