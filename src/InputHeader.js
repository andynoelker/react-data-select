import React from 'react'
import { Component } from 'react'

class InputHeader extends Component {
  focus = () => {
    this._input.focus()
  }

  blur = () => {
    this._input.blur()
  }

  render() {
    return (
      <div>
        <input type="text"  className="search-field"
                            placeholder={this.props.placeholder ? this.props.placeholder : 'Enter search term...'}
                            ref={(c) => this._input = c}
                            value={this.props.search}
                            onChange={this.props.searchChange}
                            onKeyDown={this.props.handleKeyPress}
                            onFocus={this.props.handleFocus}
                            onBlur={this.props.handleBlur}
                             />
      </div>
    )
  }
}

export default InputHeader
