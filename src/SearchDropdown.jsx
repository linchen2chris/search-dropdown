import './SearchDropdown.css';

import React, { Component } from 'react';

const optionHeight = 25;
class SearchDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyword: '',
      activeIndex: -1,
      showOptions: false
    };
  }

  componentWillMount() {
    if (this.props.value && this.props.value.length >= this.props.minLength) {
      this.setState({
        keyword: this.props.value
      });
    }
    this.props.fetchResult(this.props.value);
  }
  componentWillUnmount() {
    if (this.state.keyword) {
      this.props.onChange(this.state.keyword);
    }
  }
  onChange(value) {
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
  onSelect(value) {
    if (value === this.props.noResults) {
      return;
    }
    this.setState({
      keyword: value,
      showOptions: false
    });
    this.props.onSelect(value);
  }
  onBlur() {
    setTimeout(() => {
      if (this.input) {
        this.setState({
          keyword: this.input.value,
          showOptions: false,
          activeIndex: -1
        });
        this.props.onChange(this.input.value);
      }
    }, 200);
  }
  onKeyDown(e) {
    switch (e.keyCode) {
      case 38: //up arrow
        this.moveUp();
        break;
      case 9: //tab
        if (this.dropDown) {
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

  moveUp() {
    const totalOptions = this.props.options.length;

    if (this.state.activeIndex > 0) {
      this.dropDown.scrollTop = Math.ceil(
        this.dropDown.scrollTop - optionHeight
      );
      this.setState({ activeIndex: this.state.activeIndex - 1 });
    } else {
      this.dropDown.scrollTop = optionHeight * totalOptions;
      this.setState({ activeIndex: totalOptions - 1 });
    }
  }
  moveDown() {
    const totalOptions = this.props.options.length;

    if ((this.state.activeIndex + 1) % totaOptions > 7) {
      this.dropDown.scrollTop = Math.ceil(
        this.dropDown.scrollTop + optionHeight
      );
    } else {
      this.dropDown.scrollTop = 0;
    }
    this.setState({ activeIndex: (this.state.activeIndex + 1) % totalOptions });
  }

  highlight(option, keyword) {
    return option !== this.props.noResults
      ? option.replace(new RegExp(keyword, 'igm'), '<strong>$&</strong>')
      : option;
  }
  render() {
    return (
      <div className="search--container" onBlur={this.onBlur}>
        <input
          id={this.props.id}
          name={this.props.name}
          type="text"
          value={this.state.keyword}
          placeholder="Search..."
          ref={input => (this.input = input)}
        />
        {this.props.options.length > 0 &&
          this.state.showOptions && (
            <div
              class="search-options--container"
              ref={dropDown => (this.dropDown = dropDown)}
            />
          )}
        {this.props.options.map((option, index) => (
          <li
            id={`${this.props.id}-option${index}`}
            className={`search-option ${
              this.state.activeIndex === index ? 'search-option--active' : ''
            }`}
            key={index}
            onClick={() => this.onSelect(option)}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: this.highlight(option, this.state.keyword.trim())
              }}
            />
          </li>
        ))}
      </div>
    );
  }
}
