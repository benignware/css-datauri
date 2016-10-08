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

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PATTERN = /url\s*\(['"]*([^\'"]+)['"]*\)/gmi;

var GET_FILE = function GET_FILE(url, base) {
  return url && (0, _path.relative)(process.cwd(), (0, _path.resolve)(base, url.split("?")[0].split("#")[0]));
};

var CSSDataURI = function (_EventEmitter) {
  _inherits(CSSDataURI, _EventEmitter);

  function CSSDataURI() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, CSSDataURI);

    var _this = _possibleConstructorReturn(this, (CSSDataURI.__proto__ || Object.getPrototypeOf(CSSDataURI)).call(this));

    _this.options = Object.assign({
      filter: ['**/*'],
      base: 'auto'
    }, options);
    return _this;
  }

  _createClass(CSSDataURI, [{
    key: '_encodeAssets',
    value: function _encodeAssets(data) {
      var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
      var callback = arguments[2];


      var match = void 0;
      var assets = {};
      var matches = [];
      var options = this.options;

      // Get asset directory
      base = options.base !== 'auto' && options.base || base;
      base = _fs2.default.lstatSync(base).isDirectory() ? base : (0, _path.dirname)(base);

      var count = 0;

      // Collect pattern matches
      while (match = PATTERN.exec(data)) {
        matches.push(match);
      }
      var filter = typeof options.filter === 'string' ? options.filter.split(/\s*,\s*/) : options.filter;

      // Filter assets
      matches.forEach(function (match) {
        var url = match[1],
            file = GET_FILE(url, base);
        if (!assets[url] && (0, _multimatch2.default)([file], filter).length) {
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
              callback && callback(asset.error, assets);
            }
          });
        } else {
          asset.data = (0, _datauri.sync)(asset.file);
        }
      });

      // Immediately execute callback if no assets have been found
      if (!Object.keys(assets).length) {
        callback && callback(null, {});
      }

      // In sync mode, immediately return result
      if (!callback) {
        return assets;
      }
    }
  }, {
    key: '_encodeData',
    value: function _encodeData(data) {
      var base = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
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
    key: '_handleComplete',
    value: function _handleComplete(err, content, callback) {
      callback && callback(err, content);
      err ? this.emit('error', err) : this.emit('success', content);
      this.emit('complete', err, content);
    }
  }, {
    key: 'encode',
    value: function encode(src, dest) {
      var _this2 = this;

      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

      _fs2.default.readFile(src, "utf8", function (err, data) {
        if (err) {
          _this2._handleComplete(err, null, callback);
          return;
        }
        _this2._encodeData(data, src, function (err, content) {
          if (err) {
            _this2._handleComplete(err, null, callback);
            return;
          }
          _mkdirp2.default.sync((0, _path.dirname)(dest));
          _fs2.default.writeFile(dest, content, "utf-8", function (err) {
            _this2._handleComplete(err, content, callback);
          });
        });
      });
      return this;
    }
  }, {
    key: 'encodeSync',
    value: function encodeSync(src, dest) {
      var data = _fs2.default.readFileSync(src, "utf8");
      var content = null;
      if (data) {
        content = this._encodeData(data, src);
        if (content) {
          _mkdirp2.default.sync((0, _path.dirname)(dest));
          _fs2.default.writeFileSync(dest, content, "utf-8");
        }
      }
      this._handleComplete(!content && new Error('An error occurred when encoding'), content);
      return null;
    }
  }], [{
    key: 'promise',
    value: function promise(src, dest, options) {
      return new Promise(function (resolve, reject) {
        new CSSDataURI(options).on('error', reject).on('success', resolve).encode(src, dest);
      });
    }
  }, {
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
}(_events2.default);

exports.default = CSSDataURI;
module.exports = exports['default'];
