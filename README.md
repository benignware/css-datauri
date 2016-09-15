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
var cssDataURIEncode = require('../lib/css-datauri').encode;
cssDataURIEncode('src.css', 'dest.css', (err, content) => {
	console.log("Complete!");
}, {
	// In- or exclude files via glob patterns:
	include: ['**/*']
});

```

##### Sync

```js
var cssDataURISync = require('../lib/css-datauri').sync;
cssDataURISync('src.css', 'dest.css', , {
	// In- or exclude files via glob patterns :
	include: ['**/*']
});
```