'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var optionHeight = 25;

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
    return _this;
  }

  _createClass(SearchDropdown, [{
    key: 'onChange',
    value: async function onChange(value) {
      this.props.onChange(value);
      if (value.length < this.props.minLength) {
        this.setState({
          showOptions: false
        });
      } else if (value.length === this.props.minLength) {
        try {
          var options = await this.props.fetchResult(value);
          this.setState({
            options: options,
            filteredOptions: options,
            showOptions: true
          });
        } catch (err) {
          this.setState({
            filteredOptions: ['search error'],
            showOptions: true
          });
        }
      } else {
        var filteredOptions = this.state.options.filter(function (val) {
          return val.match(new RegExp(value, 'i')) !== null;
        });
        this.setState({ filteredOptions: filteredOptions });
      }
    }
  }, {
    key: 'onSelect',
    value: function onSelect(value) {
      if (value === this.props.noResults) {
        return;
      }
      this.setState({
        showOptions: false
      });
      this.props.onChange(value);
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
      var totalOptions = this.state.options.length;

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

      if ((this.state.activeIndex + 1) % totalOptions > 7) {
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

      var classes = this.props.classes;

      return _react2.default.createElement(
        'div',
        { className: classes.root, onBlur: function onBlur() {
            return _this3.onBlur();
          } },
        _react2.default.createElement('input', {
          id: this.props.id,
          className: classes.input,
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
              _react2.default.createElement('span', {
                dangerouslySetInnerHTML: {
                  __html: _this3.highlight(option, _this3.props.value.trim())
                }
              })
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
  value: _propTypes2.default.string,
  noResult: _propTypes2.default.string,
  minLength: _propTypes2.default.number
};

exports.default = SearchDropdown;