import {dirname, resolve, extname} from 'path';
import fs from 'fs';
import parseCSS from 'css-parse';
import stringifyCSS from 'css-stringify';
import DataURI from 'datauri';
import { sync as datauriSync } from 'datauri';
import minimatch from 'minimatch';
import mkdirp from 'mkdirp';

const PATTERN = /url\s*\(['"]*([^\'"]+)['"]*\)/gmi;

export default class CSSDataURI {

  constructor(options = {}) {
  	this.options = Object.assign({
  		include: ['**/*']
  	}, options);
  }

  _encodeAssets(data, src, callback) {
  	var dir = dirname(src);
  	let async = false;
  	// Preload assets
  	var count = 0;
  	let match;
  	var assets = {};
  	let matches = [];
  	while (match = PATTERN.exec(data)) {
  		matches.push(match);
  	}
  	matches.forEach( (match) => {
		var
			url = match[1],
			file = resolve(dir, url.split("?")[0].split("#")[0]),
			error = null;
		if (callback) {
			(new DataURI()).encode(file, (err, content) => {
				assets[url] = content;
				count++;
				if (err && !error) {
					error = err;
				} else if (count === matches.length) {
					// Complete
					callback(error, assets);
				}
			});
		} else {
			assets[url] = datauriSync(file);
		}
	});
	
  	if (!callback) {
  		return assets;
  	}
  }
  
  _encodeData(data, src, callback) {
  	let replace = (data, assets) => {
	  	return data.replace(PATTERN, (matched, url, index) => {
			return `url(${assets[url]})`;
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
