'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('./SearchDropdown.css');

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

    _this.state = {
      keyword: '',
      activeIndex: -1,
      showOptions: false
    };
    return _this;
  }

  _createClass(SearchDropdown, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      if (this.props.value && this.props.value.length >= this.props.minLength) {
        this.setState({
          keyword: this.props.value
        });
      }
      this.props.fetchResult(this.props.value);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.state.keyword) {
        this.props.onChange(this.state.keyword);
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(value) {
      if (typeof this.props.value !== 'undefined') {
        this.props.onChange(this.state.keyword);
      }
      if (value.length >= this.props.minHeight) {
        this.setState({
          keyword: value,
          showOptions: true
        });
      } else {
        this.setState({
          showOptions: false,
          keyword: value,
          activeIndex: -1
        });
      }
    }
  }, {
    key: 'onSelect',
    value: function onSelect(value) {
      if (value === this.props.noResults) {
        return;
      }
      this.setState({
        keyword: value,
        showOptions: false
      });
      this.props.onSelect(value);
    }
  }, {
    key: 'onBlur',
    value: function onBlur() {
      var _this2 = this;

      setTimeout(function () {
        if (_this2.input) {
          _this2.setState({
            keyword: _this2.input.value,
            showOptions: false,
            activeIndex: -1
          });
          _this2.props.onChange(_this2.input.value);
        }
      }, 200);
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
          if (this.dropDown) {
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
          if (this.state.activeIndex === -1) {
            return;
          }
          this.onSelect(this.props.options[this.state.activeIndex]);
          break;
        default:
          break;
      }
    }
  }, {
    key: 'moveUp',
    value: function moveUp() {
      var totalOptions = this.props.options.length;

      if (this.state.activeIndex > 0) {
        this.dropDown.scrollTop = Math.ceil(this.dropDown.scrollTop - optionHeight);
        this.setState({ activeIndex: this.state.activeIndex - 1 });
      } else {
        this.dropDown.scrollTop = optionHeight * totalOptions;
        this.setState({ activeIndex: totalOptions - 1 });
      }
    }
  }, {
    key: 'moveDown',
    value: function moveDown() {
      var totalOptions = this.props.options.length;

      if ((this.state.activeIndex + 1) % totaOptions > 7) {
        this.dropDown.scrollTop = Math.ceil(this.dropDown.scrollTop + optionHeight);
      } else {
        this.dropDown.scrollTop = 0;
      }
      this.setState({ activeIndex: (this.state.activeIndex + 1) % totalOptions });
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

      return _react2.default.createElement(
        'div',
        { className: 'search--container', onBlur: this.onBlur },
        _react2.default.createElement('input', {
          id: this.props.id,
          name: this.props.name,
          type: 'text',
          value: this.state.keyword,
          placeholder: 'Search...',
          ref: function ref(input) {
            return _this3.input = input;
          }
        }),
        this.props.options.length > 0 && this.state.showOptions && _react2.default.createElement('div', {
          'class': 'search-options--container',
          ref: function ref(dropDown) {
            return _this3.dropDown = dropDown;
          }
        }),
        this.props.options.map(function (option, index) {
          return _react2.default.createElement(
            'li',
            {
              id: _this3.props.id + '-option' + index,
              className: 'search-option ' + (_this3.state.activeIndex === index ? 'search-option--active' : ''),
              key: index,
              onClick: function onClick() {
                return _this3.onSelect(option);
              }
            },
            _react2.default.createElement('span', {
              dangerouslySetInnerHTML: {
                __html: _this3.highlight(option, _this3.state.keyword.trim())
              }
            })
          );
        })
      );
    }
  }]);

  return SearchDropdown;
}(_react.Component);