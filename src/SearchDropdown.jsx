import PropTypes from 'prop-types';
import React, { Component } from 'react';

const optionHeight = 25;
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
  }

  async onChange(value) {
    this.props.onChange(value);
    if (value.length < this.props.minLength) {
      this.setState({
        showOptions: false
      });
    } else if (value.length === this.props.minLength) {
      try {
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
    } else {
      const filteredOptions = this.state.options.filter(
        val => val.match(new RegExp(value, 'i')) !== null
      );
      this.setState({ filteredOptions });
    }
  }
  onSelect(value) {
    if (value === this.props.noResults) {
      return;
    }
    this.setState({
      showOptions: false
    });
    this.props.onChange(value);
  }
  onBlur() {
    setTimeout(() => {
      this.setState({ showOptions: false, activeIndex: -1 });
    }, 200);
  }
  moveUp() {
    const totalOptions = this.state.options.length;

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

    if ((this.state.activeIndex + 1) % totalOptions > 7) {
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
    const { classes } = this.props;
    return (
      <div className={classes.root} onBlur={() => this.onBlur()}>
        <input
          id={this.props.id}
          className={classes.input}
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
                  <span
                    dangerouslySetInnerHTML={{
                      __html: this.highlight(option, this.props.value.trim())
                    }}
                  />
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
  value: PropTypes.string,
  noResult: PropTypes.string,
  minLength: PropTypes.number
};

export default SearchDropdown;
