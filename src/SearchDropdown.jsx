import PropTypes from 'prop-types';
import React, { Component } from 'react';
import debounce from 'lodash/debounce';

const optionHeight = 72;
class SearchDropdown extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.dropdown = React.createRef();
    this.state = {
      filteredOptions: [],
      options: [],
      activeIndex: -1,
      showOptions: false
    };
    this.debounceFetch = debounce(this.fetchResult, props.debounce);
  }

  async fetchResult(value) {
    try {
      if (value.length === 0) return;
      const options = await this.props.fetchResult(value);
      this.setState({
        options,
        filteredOptions: options,
        showOptions: true
      });
    } catch (err) {
      this.setState({
        filteredOptions: ['search error'],
        showOptions: true
      });
    }
  }

  filterResult(value) {
    const filteredOptions = this.state.options.filter(
      option =>
        (typeof option === 'string' ? option : option.label).match(
          new RegExp(value, 'i')
        ) !== null
    );
    if (filteredOptions.length === 0) {
      this.setState({ activeIndex: -1 });
    }
    this.setState({
      filteredOptions,
      showOptions: true
    });
  }

  onChange(value) {
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
      } else if (
        value.length === this.props.minLength &&
        this.props.value.length < this.props.minLength
      ) {
        this.fetchResult(value);
      } else {
        this.filterResult(value);
      }
    }
  }
  onSelect(option) {
    if (option === this.props.noResults) {
      return;
    }
    this.setState({
      activeIndex: -1,
      showOptions: false
    });
    this.props.onSelect(option);
  }
  onBlur() {
    setTimeout(() => {
      this.setState({ showOptions: false, activeIndex: -1 });
    }, 200);
  }
  moveUp() {
    const totalOptions = this.state.filteredOptions.length;

    if (this.state.activeIndex > 0) {
      this.dropdown.current.scrollTop = Math.ceil(
        this.dropdown.current.scrollTop - optionHeight
      );
      this.setState({ activeIndex: this.state.activeIndex - 1 });
    } else {
      this.dropdown.current.scrollTop = optionHeight * totalOptions;
      this.setState({ activeIndex: totalOptions - 1 });
    }
  }
  moveDown() {
    const totalOptions = this.state.filteredOptions.length;

    if ((this.state.activeIndex + 1) % totalOptions >= 5) {
      this.dropdown.current.scrollTop = Math.ceil(
        this.dropdown.current.scrollTop + optionHeight
      );
    } else {
      this.dropdown.current.scrollTop = 0;
    }
    this.setState({ activeIndex: (this.state.activeIndex + 1) % totalOptions });
  }
  onKeyDown(e) {
    switch (e.keyCode) {
      case 38: //up arrow
        e.preventDefault();
        this.moveUp();
        break;
      case 9: //tab
        if (this.dropdown) {
          e.preventDefault();
          if (e.shiftKey) {
            this.moveUp();
          } else {
            this.moveDown();
          }
        }
        break;
      case 40: //down arrow
        this.moveDown();
        break;
      case 13: //enter
        if (this.state.activeIndex === -1) {
          return;
        }
        this.onSelect(this.state.filteredOptions[this.state.activeIndex]);
        break;
      default:
        break;
    }
  }
  highlight(option, keyword) {
    return option !== this.props.noResults
      ? option.replace(new RegExp(keyword, 'igm'), '<strong>$&</strong>')
      : option;
  }

  render() {
    const { classes, error } = this.props;
    return (
      <div
        className={`${classes.root} ${error ? classes.error : ''}`}
        onBlur={() => this.onBlur()}
      >
        <input
          id={this.props.id}
          className={`${classes.input} ${error ? classes.error : ''}`}
          name={this.props.name}
          type="text"
          value={this.props.value}
          placeholder="Search..."
          ref={this.input}
          onKeyDown={e => this.onKeyDown(e)}
          onChange={e => this.onChange(e.target.value)}
        />
        {this.state.filteredOptions.length >= 0 &&
          this.state.showOptions && (
            <div className={classes.dropdown} ref={this.dropdown}>
              {this.state.filteredOptions.length === 0 && (
                <li className={classes.option}>
                  <strong>{this.props.noResult}</strong>
                </li>
              )}
              {this.state.filteredOptions.map((option, index) => (
                <li
                  id={`${this.props.id}-option${index}`}
                  className={
                    this.state.activeIndex === index
                      ? classes.optionActive
                      : classes.option
                  }
                  key={index}
                  onClick={() => this.onSelect(option)}
                >
                  <p
                    className={classes.label}
                    dangerouslySetInnerHTML={{
                      __html: this.highlight(
                        typeof option === 'string' ? option : option.label,
                        this.props.value.trim()
                      )
                    }}
                  />
                  {option.description && (
                    <p className={classes.description}>{option.description}</p>
                  )}
                </li>
              ))}
            </div>
          )}
      </div>
    );
  }
}
SearchDropdown.propTypes = {
  fetchResult: PropTypes.func.isRequired,
  classes: PropTypes.object,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  value: PropTypes.string,
  noResult: PropTypes.string,
  error: PropTypes.bool,
  minLength: PropTypes.number,
  debounce: PropTypes.number
};

export default SearchDropdown;
