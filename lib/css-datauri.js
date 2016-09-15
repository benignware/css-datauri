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

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

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
      include: ['**/*']
    }, options);
  }

  _createClass(CSSDataURI, [{
    key: '_encodeAssets',
    value: function _encodeAssets(data, src, callback) {
      var dir = (0, _path.dirname)(src);
      var async = false;
      // Preload assets
      var count = 0;
      var match = void 0;
      var assets = {};
      var matches = [];
      while (match = PATTERN.exec(data)) {
        matches.push(match);
      }
      matches.forEach(function (match) {
        var url = match[1],
            file = (0, _path.resolve)(dir, url.split("?")[0].split("#")[0]),
            error = null;
        if (callback) {
          new _datauri2.default().encode(file, function (err, content) {
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
          assets[url] = (0, _datauri.sync)(file);
        }
      });

      if (!callback) {
        return assets;
      }
    }
  }, {
    key: '_encodeData',
    value: function _encodeData(data, src, callback) {
      var replace = function replace(data, assets) {
        return data.replace(PATTERN, function (matched, url, index) {
          return 'url(' + assets[url] + ')';
        });
      };
      var assets = this._encodeAssets(data, src, callback ? function (err, assets) {
        var content = replace(data, assets);
        callback(err, content);
      } : undefined);
      return assets ? replace(data, assets) : null;
    }
  }, {
    key: 'encode',
    value: function encode(src, dest, callback) {
      var _this = this;

      _fs2.default.readFile(src, "utf8", function (err, data) {
        if (err) {
          callback(err, null);
          return;
        }
        _this._encodeData(data, src, function (err, content) {
          if (err) {
            callback(err, null);
            return;
          }
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
          _fs2.default.writeFileSync(dest, content, "utf-8");
          return content;
        }
      }
      // Error loading file
      return null;
    }
  }], [{
    key: 'promise',
    value: function promise(src, dest, options) {
      var datauri = new _datauri2.default();
      return new Promise(function (resolve, reject) {
        datauri.on('encoded', resolve).on('error', reject).encode(src, dest, options);
      });
    }
  }, {
    key: 'sync',
    value: function sync(src, dest) {
      var content = new CSSDataURI(options).encodeSync(src, dest);
      return content;
    }
  }, {
    key: 'encode',
    value: function encode(src, dest, callback) {
      new CSSDataURI(options).encode(src, dest, callback);
    }
  }]);

  return CSSDataURI;
}();

exports.default = CSSDataURI;
module.exports = exports['default'];
