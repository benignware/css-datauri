css-datauri
===========

> Embed assets in css files



## Install

```cli
npm install css-datauri --save-dev
```


## Usage

##### Async

```js
var CSSDataURI = require('css-datauri');
(new CSSDataURI({
	// In- or exclude assets via glob patterns:
	include: ['**\/*']
})).encode('src/styles.css', 'dest/styles.css', (err, data) => {
	// Complete
});
```

##### Sync
```js
var cssDataURISync = require('css-datauri').sync;
cssDataURISync('src/styles.css', 'dest/styles.css', , {
	// In- or exclude assets via glob patterns:
	include: ['**/*']
});
```