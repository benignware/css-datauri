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
var CSSDataURI = require('../lib/css-datauri');
(new CSSDataURI({
	// In- or exclude files via glob patterns:
	include: ['**/*']
})).encode('src.css', 'dest.css', (err, content) => {
	console.log("Complete!");
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