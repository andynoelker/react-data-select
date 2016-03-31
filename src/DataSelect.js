import React from 'react'
import { Component } from 'react'
import { Table, Column, Cell } from 'fixed-data-table'
import Immutable from 'immutable'
import hasClass from './utils/hasClass'

class DataSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      highlighted: 0,
      selected: undefined,
      search: '',
      list: Immutable.List(),
      canCollapse: true,
    }
  }

  componentWillMount() {
    this.setState({list: this.props.locations})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return     this.state.highlighted !== nextState.highlighted
            || this.state.list.hashCode() !== nextState.list.hashCode()
            || this.state.show !== nextState.show
            || this.state.search !== nextState.search
  }

  componentDidUpdate() {
    this.props.handleChange({
        text: this.state.search,
        selected: this.state.selected,
    })
  }

  handleClick = (rowIndex) => {
    let searchText = this.state.list.getIn([rowIndex, 'wh_aisle_id'])
                      + '-' + this.state.list.getIn([rowIndex, 'wh_location_name'])
    let filtered = Immutable.List().push(this.state.list.get(rowIndex))
    this.setState({
      selected: this.state.list.get(rowIndex),
      highlighted: 0,
      search: searchText,
      show: false,
      list: filtered,
      canCollapse : true,
    })
  }

  searchChange = (e) => {
    this.filterList(e.target.value)
  }

  filterList = (search) => {
    const regex = new RegExp(search, 'i')
    let filtered = this.props.locations.filter(item => {
      return ((item.get('wh_aisle_id') + '-' + item.get('wh_location_name')).search(regex) > -1)
    })

    this.setState({
      search: search,
      list: filtered,
      highlighted: 0,
      selected: filtered.get(0)
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'ArrowDown') {
      if (this.state.highlighted < this.state.list.size - 1) {
        this.setState({highlighted: this.state.highlighted + 1})
      }
    } else if (e.key === 'ArrowUp') {
      if (this.state.highlighted > 0) {
        this.setState({highlighted: this.state.highlighted - 1})
      }
    } else if (e.key === 'Enter') {
      if (this.state.list.size > 0) {
        this._input.blur()
        let searchText = this.state.list.getIn([this.state.highlighted, 'wh_aisle_id'])
                        + '-' + this.state.list.getIn([this.state.highlighted, 'wh_location_name'])
        let filtered = Immutable.List().push(this.state.list.get(this.state.highlighted))
        this.setState({
          selected: this.state.list.get(this.state.highlighted),
          list: filtered,
          highlighted: 0,
          search: searchText,
          show: false,
          canCollapse : true,
        })
      }
    }
  }

  /**
   * If the input field is focused, show dropdown.
   */
  handleFocus = () => {
    this.setState({show: true})
  }

  /**
   * If the list is collapsible, collapse it on a blur.
   */
  handleBlur = (e) => {
    if (this.state.canCollapse) {
      this.setState({show: false})
    }
  }

  /**
   * After clicking the scrollbar, refocus the input field.
   * By clicking into the scrollbar originally, input loses its focus
   * and needs it back in order to detect if the user clicks outside.
   */
  mouseUp = (e) => {
    if (hasClass(e.target, 'ScrollbarLayout_face')) {
      this._input.focus()
    }
  }

  /**
   * If the mouse is hovering over the app, cannot collapse dropdown on a blur
   * unless overridden by clicking an item or pressing 'Enter'.
   */
  mouseEnter = (e) => {
    this.setState({canCollapse: false})
  }

  /**
   * Once the mouse leaves the app we always want to collapse menu on a blur.
   */
  mouseLeave = (e) => {
    this.setState({canCollapse: true})
  }

  render() {
    let dataLength = this.state.show ? this.state.list.size : 0
    return (
      <div className="col-sm-4">
      <div className="data-select" onMouseEnter={this.mouseEnter}
                                    onMouseLeave={this.mouseLeave}
                                    onMouseUp={this.mouseUp}>
        <Table
          rowHeight={30}
          headerHeight={36}
          rowsCount={dataLength}
          width={275}
          height={200}
          scrollToRow={this.state.highlighted}>
          <Column
            header={<InputHeader
                      ref={(c) => this._input = c}
                      searchChange={this.searchChange}
                      handleFocus={this.handleFocus}
                      handleBlur={this.handleBlur}
                      handleKeyPress={this.handleKeyPress}
                      search={this.state.search}
                      canCollapse={this.state.canCollapse} />
                  }
            cell={<DataCell data={this.state.list}
                            handleClick={this.handleClick}
                            highlighted={this.state.highlighted} />
                  }
            fixed={true}
            width={275} />
        </Table>
      </div>
      </div>
    )
  }
}

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

class DataCell extends Component {
  handleClick = (e) => {
    this.props.handleClick(this.props.rowIndex)
  }

  render() {
    const {rowIndex, data,  ...props} = this.props
    return (
      <div onClick={this.handleClick}
            className={this.props.highlighted === rowIndex ? 'data-select-active data-row' : 'data-row'}>
        {data.getIn([rowIndex, 'wh_aisle_id']) + '-' + data.getIn([rowIndex, 'wh_location_name'])}
      </div>
    )
  }
}

export default DataSelect
