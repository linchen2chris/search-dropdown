'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var optionHeight = 72;

var SearchDropdown = function (_Component) {
  _inherits(SearchDropdown, _Component);

  function SearchDropdown(props) {
    _classCallCheck(this, SearchDropdown);

    var _this = _possibleConstructorReturn(this, (SearchDropdown.__proto__ || Object.getPrototypeOf(SearchDropdown)).call(this, props));

    _this.input = _react2.default.createRef();
    _this.dropdown = _react2.default.createRef();
    _this.state = {
      filteredOptions: [],
      options: [],
      activeIndex: -1,
      showOptions: false
    };
    _this.debounceFetch = _lodash2.default.debounce(_this.fetchResult, props.debounce);
    return _this;
  }

  _createClass(SearchDropdown, [{
    key: 'fetchResult',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(value) {
        var options;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                if (!(value.length === 0)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return');

              case 3:
                _context.next = 5;
                return this.props.fetchResult(value);

              case 5:
                options = _context.sent;

                this.setState({
                  options: options,
                  filteredOptions: options,
                  showOptions: true
                });
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](0);

                this.setState({
                  filteredOptions: ['search error'],
                  showOptions: true
                });

              case 12:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function fetchResult(_x) {
        return _ref.apply(this, arguments);
      }

      return fetchResult;
    }()
  }, {
    key: 'filterResult',
    value: function filterResult(value) {
      var filteredOptions = this.state.options.filter(function (option) {
        return (typeof option === 'string' ? option : option.label).match(new RegExp(value, 'i')) !== null;
      });
      if (filteredOptions.length === 0) {
        this.setState({ activeIndex: -1 });
      }
      this.setState({
        filteredOptions: filteredOptions,
        showOptions: true
      });
    }
  }, {
    key: 'onChange',
    value: function onChange(value) {
      this.props.onChange(value);
      if (this.props.debounce) {
        this.debounceFetch(value);
        return;
      }
      if (this.props.minLength) {
        if (value.length < this.props.minLength) {
          this.setState({
            activeIndex: -1,
            showOptions: false
          });
        } else if (value.length === this.props.minLength && this.props.value.length < this.props.minLength) {
          this.fetchResult(value);
        } else {
          this.filterResult(value);
        }
      }
    }
  }, {
    key: 'onSelect',
    value: function onSelect(option) {
      if (option === this.props.noResults) {
        return;
      }
      this.setState({
        activeIndex: -1,
        showOptions: false
      });
      this.props.onSelect(option);
    }
  }, {
    key: 'onBlur',
    value: function onBlur() {
      var _this2 = this;

      setTimeout(function () {
        _this2.setState({ showOptions: false, activeIndex: -1 });
      }, 200);
    }
  }, {
    key: 'moveUp',
    value: function moveUp() {
      var totalOptions = this.state.filteredOptions.length;

      if (this.state.activeIndex > 0) {
        this.dropdown.current.scrollTop = Math.ceil(this.dropdown.current.scrollTop - optionHeight);
        this.setState({ activeIndex: this.state.activeIndex - 1 });
      } else {
        this.dropdown.current.scrollTop = optionHeight * totalOptions;
        this.setState({ activeIndex: totalOptions - 1 });
      }
    }
  }, {
    key: 'moveDown',
    value: function moveDown() {
      var totalOptions = this.state.filteredOptions.length;

      if ((this.state.activeIndex + 1) % totalOptions >= 5) {
        this.dropdown.current.scrollTop = Math.ceil(this.dropdown.current.scrollTop + optionHeight);
      } else {
        this.dropdown.current.scrollTop = 0;
      }
      this.setState({ activeIndex: (this.state.activeIndex + 1) % totalOptions });
    }
  }, {
    key: 'onKeyDown',
    value: function onKeyDown(e) {
      switch (e.keyCode) {
        case 38:
          //up arrow
          e.preventDefault();
          this.moveUp();
          break;
        case 9:
          //tab
          if (this.dropdown) {
            e.preventDefault();
            if (e.shiftKey) {
              this.moveUp();
            } else {
              this.moveDown();
            }
          }
          break;
        case 40:
          //down arrow
          this.moveDown();
          break;
        case 13:
          //enter
          if (this.state.activeIndex === -1) {
            return;
          }
          this.onSelect(this.state.filteredOptions[this.state.activeIndex]);
          break;
        default:
          break;
      }
    }
  }, {
    key: 'highlight',
    value: function highlight(option, keyword) {
      return option !== this.props.noResults ? option.replace(new RegExp(keyword, 'igm'), '<strong>$&</strong>') : option;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          classes = _props.classes,
          error = _props.error;

      return _react2.default.createElement(
        'div',
        {
          className: classes.root + ' ' + (error ? classes.error : ''),
          onBlur: function onBlur() {
            return _this3.onBlur();
          }
        },
        _react2.default.createElement('input', {
          id: this.props.id,
          className: classes.input + ' ' + (error ? classes.error : ''),
          name: this.props.name,
          type: 'text',
          value: this.props.value,
          placeholder: 'Search...',
          ref: this.input,
          onKeyDown: function onKeyDown(e) {
            return _this3.onKeyDown(e);
          },
          onChange: function onChange(e) {
            return _this3.onChange(e.target.value);
          }
        }),
        this.state.filteredOptions.length >= 0 && this.state.showOptions && _react2.default.createElement(
          'div',
          { className: classes.dropdown, ref: this.dropdown },
          this.state.filteredOptions.length === 0 && _react2.default.createElement(
            'li',
            { className: classes.option },
            _react2.default.createElement(
              'strong',
              null,
              this.props.noResult
            )
          ),
          this.state.filteredOptions.map(function (option, index) {
            return _react2.default.createElement(
              'li',
              {
                id: _this3.props.id + '-option' + index,
                className: _this3.state.activeIndex === index ? classes.optionActive : classes.option,
                key: index,
                onClick: function onClick() {
                  return _this3.onSelect(option);
                }
              },
              _react2.default.createElement('p', {
                className: classes.label,
                dangerouslySetInnerHTML: {
                  __html: _this3.highlight(typeof option === 'string' ? option : option.label, _this3.props.value.trim())
                }
              }),
              option.description && _react2.default.createElement(
                'p',
                { className: classes.description },
                option.description
              )
            );
          })
        )
      );
    }
  }]);

  return SearchDropdown;
}(_react.Component);

SearchDropdown.propTypes = {
  fetchResult: _propTypes2.default.func.isRequired,
  classes: _propTypes2.default.object,
  onChange: _propTypes2.default.func,
  onSelect: _propTypes2.default.func,
  value: _propTypes2.default.string,
  noResult: _propTypes2.default.string,
  error: _propTypes2.default.bool,
  minLength: _propTypes2.default.number,
  debounce: _propTypes2.default.number
};

exports.default = SearchDropdown;