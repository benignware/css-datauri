'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _cssParse = require('css-parse');

var _cssParse2 = _interopRequireDefault(_cssParse);

var _cssStringify = require('css-stringify');

var _cssStringify2 = _interopRequireDefault(_cssStringify);

var _datauri = require('datauri');

var _datauri2 = _interopRequireDefault(_datauri);

var _multimatch = require('multimatch');

var _multimatch2 = _interopRequireDefault(_multimatch);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PATTERN = /url\s*\(['"]*([^\'"]+)['"]*\)/gmi;

var CSSDataURI = function () {
  function CSSDataURI() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, CSSDataURI);

    this.options = Object.assign({
      filter: ['**/*']
    }, options);
  }

  _createClass(CSSDataURI, [{
    key: '_encodeAssets',
    value: function _encodeAssets(data) {
      var _this = this;

      var base = arguments.length <= 1 || arguments[1] === undefined ? '.' : arguments[1];
      var callback = arguments[2];

      // Get asset directory
      var dir = _fs2.default.lstatSync(base).isDirectory() ? base : (0, _path.dirname)(base);

      var count = 0;
      var match = void 0;
      var assets = {};
      var matches = [];
      var getFilename = function getFilename(url) {
        return url && (0, _path.relative)(process.cwd(), (0, _path.resolve)(dir, url.split("?")[0].split("#")[0]));
      };

      // Collect pattern matches
      while (match = PATTERN.exec(data)) {
        matches.push(match);
      }
      // Filter assets
      matches.forEach(function (match) {
        var url = match[1],
            file = getFilename(url);
        if (!assets[url] && (0, _multimatch2.default)([file], _this.options.filter).length) {
          assets[url] = {
            file: file
          };
        }
      });
      // Load assets
      Object.keys(assets).forEach(function (url) {
        var asset = assets[url];
        if (callback) {
          new _datauri2.default().encode(asset.file, function (err, content) {
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
          asset.data = (0, _datauri.sync)(asset.file);
        }
      });

      // In sync mode, immediately return result
      if (!callback) {
        return assets;
      }
    }
  }, {
    key: '_encodeData',
    value: function _encodeData(data) {
      var base = arguments.length <= 1 || arguments[1] === undefined ? '.' : arguments[1];
      var callback = arguments[2];

      var replace = function replace(data, assets) {
        return data.replace(PATTERN, function (matched, url, index) {
          return assets[url] && 'url(' + assets[url].data + ')' || matched;
        });
      };
      var assets = this._encodeAssets(data, base, callback ? function (err, assets) {
        var content = replace(data, assets);
        callback(err, content);
      } : undefined);
      return assets ? replace(data, assets) : null;
    }
  }, {
    key: 'encode',
    value: function encode(src, dest, callback) {
      var _this2 = this;

      _fs2.default.readFile(src, "utf8", function (err, data) {
        if (err) {
          callback(err, null);
          return;
        }
        _this2._encodeData(data, src, function (err, content) {
          if (err) {
            callback(err, null);
            return;
          }
          _mkdirp2.default.sync((0, _path.dirname)(dest));
          _fs2.default.writeFile(dest, content, "utf-8", function (err) {
            callback(err, content);
          });
        });
      });
    }
  }, {
    key: 'encodeSync',
    value: function encodeSync(src, dest) {
      var data = _fs2.default.readFileSync(src, "utf8");
      if (data) {
        var content = this._encodeData(data, src);
        if (content) {
          _mkdirp2.default.sync((0, _path.dirname)(dest));
          _fs2.default.writeFileSync(dest, content, "utf-8");
          return content;
        }
      }
      // Error loading file
      return null;
    }
  }], [{
    key: 'sync',
    value: function sync(src, dest, options) {
      var content = new CSSDataURI(options).encodeSync(src, dest);
      return content;
    }
  }, {
    key: 'encode',
    value: function encode(src, dest, callback, options) {
      new CSSDataURI(options).encode(src, dest, callback);
    }
  }]);

  return CSSDataURI;
}();

exports.default = CSSDataURI;
module.exports = exports['default'];
