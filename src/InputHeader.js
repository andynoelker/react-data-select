import React from 'react'
import { Component } from 'react'

class InputHeader extends Component {
  focus = () => {
    this.refs.inputHeader.focus()
  }

  blur = () => {
    this.refs.inputHeader.blur()
  }

  render() {
    return (
      <div className="selectize-input items not-full has-options">
        <input type="text"  className="search-field" placeholder="Enter a location..."
                            ref="inputHeader"
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
