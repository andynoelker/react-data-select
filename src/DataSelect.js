import React from 'react'
import { Component } from 'react'
import { Table, Column, Cell } from 'fixed-data-table'
import Immutable from 'immutable'
import InputHeader from './InputHeader'
import DataRow from './DataRow'
import hasClass from './utils/hasClass'
import getListFieldText from './utils/getListFieldText'

class DataSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      highlighted: 0,
      selected: undefined,
      search: '',
      data: Immutable.List(),
      list: Immutable.List(),
      canCollapse: true,
      scrolling: false,
    }
  }

  componentWillMount() {
    let data = Immutable.List.isList(this.props.data) ? this.props.data : Immutable.fromJS(this.props.data)
    this.setState({data: data, list: data})
  }

  componentWillReceiveProps(nextProps) {
    let data = Immutable.List.isList(nextProps.data) ? nextProps.data : Immutable.fromJS(nextProps.data)
    if (data.hashCode() !== this.state.data.hashCode()) {
      this.setState({data: data, list: data})
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return     this.state.highlighted !== nextState.highlighted
            || this.state.show !== nextState.show
            || this.state.search !== nextState.search
            || this.state.data.hashCode() !== nextState.data.hashCode()
            || this.state.list.hashCode() !== nextState.list.hashCode()
  }

  componentDidUpdate() {
    this.props.handleChange({
        text: this.state.search,
        selected: this.state.selected,
    })
  }

  handleClick = (rowIndex) => {
    let searchText = getListFieldText(this.state.list.get(rowIndex), this.props.listField)
    let filtered = Immutable.List().push(this.state.list.get(rowIndex))
    this.setState({
      selected: this.state.list.get(rowIndex),
      highlighted: 0,
      search: searchText,
      show: false,
      list: filtered,
    })
  }

  searchChange = (e) => {
    this.filterList(e.target.value)
  }

  filterList = (search) => {
    const regex = new RegExp(search, 'i')
    let filtered = this.state.data.filter(item => {
      return (getListFieldText(item, this.props.listField).search(regex) > -1)
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
        let searchText = getListFieldText(this.state.list.get(this.state.highlighted), this.props.listField)
        let filtered = Immutable.List().push(this.state.list.get(this.state.highlighted))
        this.setState({
          selected: this.state.list.get(this.state.highlighted),
          list: filtered,
          highlighted: 0,
          search: searchText,
          show: false,
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
   * Track start of scroll so if mouseUp happens while hovering cursor
   * over different part of the app, it still knows to refocus
   */
  mouseDown = (e) => {
    if (hasClass(e.target, 'ScrollbarLayout_face')) {
      this.setState({scrolling: true})
    }
  }

  /**
   * After clicking the scrollbar, refocus the input field.
   * By clicking into the scrollbar originally, input loses its focus
   * and needs it back in order to detect if the user clicks outside.
   */
  mouseUp = (e) => {
    if (hasClass(e.target, 'ScrollbarLayout_face') || this.state.scrolling) {
      this.setState({scrolling: false})
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
      <div className="data-select" onMouseEnter={this.mouseEnter}
                                    onMouseLeave={this.mouseLeave}
                                    onMouseUp={this.mouseUp}
                                    onMouseDown={this.mouseDown}>
        <Table
          rowHeight={30}
          headerHeight={36}
          rowsCount={dataLength}
          width={this.props.width}
          height={200}
          scrollToRow={this.state.highlighted}>
          <Column
            header={<InputHeader
                      ref={(c) => this._input = c}
                      searchChange={this.searchChange}
                      handleFocus={this.handleFocus}
                      handleBlur={this.handleBlur}
                      handleKeyPress={this.handleKeyPress}
                      search={this.state.search} />
                  }
            cell={<DataRow data={this.state.list}
                            handleClick={this.handleClick}
                            highlighted={this.state.highlighted}
                            listField={this.props.listField} />
                  }
            fixed={true}
            width={this.props.width} />
        </Table>
      </div>
    )
  }
}

DataSelect.defaultProps = {
  width: 275
}

DataSelect.propTypes = {
  handleChange: React.PropTypes.func.isRequired,
  width: React.PropTypes.number,
  listField: (props, propName, componentName) => {
    if (typeof props[propName] !== 'undefined' && typeof props[propName] !== 'string' && typeof props[propName] !== 'object') {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      )
    }
  },
  data: (props, propName, componentName) => {
    if (props[propName] === null || (!Array.isArray(props[propName]) && !Immutable.List.isList(props[propName]))) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      )
    }
  }
}

export default DataSelect
