import {dirname, resolve, extname} from 'path';
import fs from 'fs';
import parseCSS from 'css-parse';
import stringifyCSS from 'css-stringify';
import DataURI from 'datauri';
import { sync as datauriSync } from 'datauri';
import multimatch from 'multimatch';
import mkdirp from 'mkdirp';

const PATTERN = /url\s*\(['"]*([^\'"]+)['"]*\)/gmi;

export default class CSSDataURI {

  constructor(options = {}) {
  	this.options = Object.assign({
  		filter: ['**/*']
  	}, options);
  }

  _encodeAssets(data, src, callback) {
  	var dir = dirname(src);
  	let async = false;
  	
  	var count = 0;
  	let match;
  	let assets = {};
  	let matches = [];
  	const getFilename = (url) => url && resolve(dir, url.split("?")[0].split("#")[0]);
  	
  	// Collect pattern matches
  	while (match = PATTERN.exec(data)) {
  		matches.push(match);
  	}
  	// Filter assets
  	matches.forEach( (match) => {
  		var
			url = match[1],
			file = getFilename(url);
		if ( !assets[url] && multimatch( [file], this.options.filter ).length ) {
			assets[url] = {
				file: file
			};
		}
	});
  	// Load assets
	Object.keys(assets).forEach( (url) => {
		let asset = assets[url];
		if (callback) {
			(new DataURI()).encode(asset.file, (err, content) => {
				asset.data = content;
				count++;
				if (err && !asset.error) {
					asset.error = err;
				}
				if (count === Object.keys(assets).length) {
					// Complete
					callback(asset.error, assets);
				}
			});
		} else {
			asset.data = datauriSync(asset.file);
		}
	});
	
	// In sync mode, immediately return result
  	if (!callback) {
  		return assets;
  	}
  }
  
  _encodeData(data, src, callback) {
  	let replace = (data, assets) => {
	  	return data.replace(PATTERN, (matched, url, index) => {
			return assets[url] && `url(${assets[url].data})` || matched;
		});
	};
  	let assets = this._encodeAssets(data, src, callback ? (err, assets) => {
  		var content = replace(data, assets);
  		callback(err, content);
  	} : undefined);
	return assets ? replace(data, assets) : null;
  }
  
  encode(src, dest, callback) {
	fs.readFile(src, "utf8", (err, data) => {
		if (err) {
			callback(err, null);
			return;
		}
  		this._encodeData(data, src, (err, content) => {
			if (err) {
				callback(err, null);
				return;
			}
			mkdirp.sync(dirname(dest));
			fs.writeFile(dest, content, "utf-8", (err) => {
			  callback(err, content);
			});
		});
  	});
  }
  
  encodeSync(src, dest) {
  	let data = fs.readFileSync(src, "utf8");
   	if (data) {
   		var content = this._encodeData(data, src);
   		if (content) {
   			mkdirp.sync(dirname(dest));
   			fs.writeFileSync(dest, content, "utf-8");
   			return content;
   		}
   	}
   	// Error loading file
   	return null;
  }

  static sync(src, dest, options) {
    let content = (new CSSDataURI(options)).encodeSync(src, dest);
    return content;
  }
  
  static encode(src, dest, callback, options) {
    (new CSSDataURI(options)).encode(src, dest, callback);
  }
  
}