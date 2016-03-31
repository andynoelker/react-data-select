import React from 'react'
import { Component } from 'react'
import getListFieldText from './utils/getListFieldText'

class DataRow extends Component {
  handleClick = (e) => {
    this.props.handleClick(this.props.rowIndex)
  }

  render() {
    const { rowIndex, data } = this.props
    return (
      <div onClick={this.handleClick}
            className={this.props.highlighted === rowIndex ? 'data-select-active data-row' : 'data-row'}>
        {getListFieldText(data.get(rowIndex), this.props.listField)}
      </div>
    )
  }
}

export default DataRow
