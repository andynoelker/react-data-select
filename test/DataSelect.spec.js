import { expect } from 'chai'
import React from 'react'
import { Component } from 'react'
import TestUtils from 'react-addons-test-utils'
import sinon from 'sinon'
import DataSelect from '../src/DataSelect'
import Immutable from 'immutable'
import { fakeImmutableData as Immutabledata, fakeData } from './helpers/data'

describe('DataSelect', () => {
    let component, divs, input, onChange, sandbox

    beforeEach('instantiate DataSelect instance', () => {
      sandbox = sinon.sandbox.create()
      sandbox.stub(console, "error")

      onChange = sinon.spy((e) => {
        return 'changed'
      })

      component = TestUtils.renderIntoDocument(<DataSelect  data={Immutabledata}
                                                            onChange={onChange}
                                                            listField={{fields: ['firstName', 'lastName']}} />)
      divs = TestUtils.scryRenderedDOMComponentsWithTag(component, "div")
      input = TestUtils.findRenderedDOMComponentWithTag(component, "input")
    })

    afterEach(function () {
        sandbox.restore();
    });

    it ('should render with correct data', () => {
      expect(divs[0].className).to.equal('data-select')
      expect(component.state.list.size).to.equal(12)
      expect(component.state.list.getIn([0, 'firstName'])).to.equal('Darth')
    })

    it ('should convert Javascript data array to ImmutableJS List', () => {
      let component = TestUtils.renderIntoDocument(<DataSelect  data={fakeData}
                                                            onChange={onChange}
                                                            listField={{fields: ['firstName', 'lastName']}} />)
      expect(Immutable.List.isList(component.state.data)).to.be.true
    })

    it ('should update data list when passed new data', () => {
      let component = TestUtils.renderIntoDocument(<Parent  data={Immutable.List()}
                                                            onChange={onChange}
                                                            listField={{fields: ['firstName', 'lastName']}} />)

      expect(component.dataSelect.state.list.size).to.equal(0)

      component.setState({data: Immutabledata})
      expect(component.dataSelect.state.list.size).to.equal(12)
      component.setState({data: fakeData})
      expect(component.dataSelect.state.list.size).to.equal(12)
    })

    it ('should show the dropdown when the input field is focused', () => {
      expect(component.state.show).to.be.false
      TestUtils.Simulate.focus(input)
      expect(component.state.show).to.be.true
    })

    it ('should collapse dropdown when input is blurred, if collapsible', () => {
      expect(component.state.show).to.be.false
      TestUtils.Simulate.mouseEnter(divs[0]) //sets canCollapse to false
      TestUtils.Simulate.focus(input)
      TestUtils.Simulate.blur(input)
      //will be true (not collapsed) because state.canCollapse is false
      expect(component.state.show).to.be.true

      TestUtils.Simulate.focus(input)
      TestUtils.Simulate.mouseLeave(divs[0]) //sets canCollapse to true
      TestUtils.Simulate.blur(input)
      expect(component.state.show).to.be.false
    })

    it ('should prevent, then allow collapsing when the mouse enters and leaves the component', () => {
      expect(component.state.canCollapse).to.be.true
      TestUtils.Simulate.mouseEnter(divs[0])
      expect(component.state.canCollapse).to.be.false
      TestUtils.Simulate.mouseLeave(divs[0])
      expect(component.state.canCollapse).to.be.true
    })

    it ('should prevent collapsing when pressing down on the scrollbar', () => {
      //focus input to make scrollbar appear
      TestUtils.Simulate.mouseEnter(divs[0])
      TestUtils.Simulate.focus(input)
      let scrollbar = TestUtils.findRenderedDOMComponentWithClass(component, 'ScrollbarLayout_face')

      TestUtils.Simulate.mouseDown(divs[0], {target: scrollbar })
      expect(component.state.scrolling).to.be.true

      //allow collapsing for anything else that is not scrollbar
      TestUtils.Simulate.mouseUp(divs[0], {target: scrollbar })
      TestUtils.Simulate.mouseDown(divs[0])
      expect(component.state.scrolling).to.be.false
      TestUtils.Simulate.mouseUp(divs[0])
      expect(component.state.scrolling).to.be.false
    })

    it ('should refocus input when clicking off of the scrollbar', () => {
      //focus input to make scrollbar appear
      TestUtils.Simulate.mouseEnter(divs[0])
      TestUtils.Simulate.focus(input)
      let scrollbar = TestUtils.findRenderedDOMComponentWithClass(component, 'ScrollbarLayout_face')

      TestUtils.Simulate.mouseDown(divs[0], {target: scrollbar })
      expect(input === document.activeElement).to.be.false
      TestUtils.Simulate.mouseUp(divs[0], {target: scrollbar })
      expect(input === document.activeElement).to.be.true

      //focus input even when releasing mouse over non-scrollbar element
      //press Enter b/c it is only thing that will blur real DOM node during test
      TestUtils.Simulate.keyDown(input, {key: 'Enter'})
      TestUtils.Simulate.mouseDown(divs[0], {target: scrollbar })
      expect(input === document.activeElement).to.be.false
      TestUtils.Simulate.mouseUp(divs[0])
      expect(input === document.activeElement).to.be.true
    })

    it ('should filter list when typing into input', () => {
      TestUtils.Simulate.change(input, {target: {value: 'Luke'}})
      expect(component.state.list.size).to.equal(1)
    })

    it ('should select item from list when clicked', () => {
      //focus input to make dropdown appear
      TestUtils.Simulate.mouseEnter(divs[0])
      TestUtils.Simulate.focus(input)
      let rows = TestUtils.scryRenderedDOMComponentsWithClass(component, "data-row")

      TestUtils.Simulate.click(rows[3])
      expect(component.state.list.size).to.equal(1)
      expect(component.state.selected.get('firstName')).to.equal('Leia')
      expect(component.state.highlighted).to.equal(0)
    })

    it ('should change selected items based on keyboard navigation', () => {
      //focus input to make dropdown appear
      TestUtils.Simulate.mouseEnter(divs[0])
      TestUtils.Simulate.focus(input)

      //pressing up at start of list, should keep highlight at first item
      TestUtils.Simulate.keyDown(input, {key: 'ArrowUp'})
      expect(component.state.highlighted).to.equal(0)

      //move highlight to second item on list
      TestUtils.Simulate.keyDown(input, {key: 'ArrowDown'})
      expect(component.state.highlighted).to.equal(1)

      //go to third and back to second item on list
      TestUtils.Simulate.keyDown(input, {key: 'ArrowDown'})
      TestUtils.Simulate.keyDown(input, {key: 'ArrowUp'})
      expect(component.state.highlighted).to.equal(1)

      //select second item
      TestUtils.Simulate.keyDown(input, {key: 'Enter'})
      expect(component.state.list.size).to.equal(1)
      expect(component.state.selected.get('firstName')).to.equal('Luke')
      expect(component.state.highlighted).to.equal(0)
      expect(component.state.search).to.equal('Luke Skywalker')

      //pressing down at bottom of the list should keep highlight on last item
      TestUtils.Simulate.focus(input)
      TestUtils.Simulate.keyDown(input, {key: 'ArrowDown'})
      expect(component.state.highlighted).to.equal(0)

      //ignore all keypresses that are not 'ArrowUp', 'ArrowDown', and 'Enter'
      TestUtils.Simulate.keyDown(input, {key: 'a'})
      expect(component.state.highlighted).to.equal(0)
    })

    it ('should ignore Enter press for empty list', () => {
      let emptyData = Immutable.List([])
      component = TestUtils.renderIntoDocument(<DataSelect  data={emptyData}
                                                            onChange={onChange}
                                                            listField={{fields: ['firstName', 'lastName']}} />)
      let divs = TestUtils.scryRenderedDOMComponentsWithTag(component, "div")
      let input = TestUtils.findRenderedDOMComponentWithTag(component, "input")

      TestUtils.Simulate.mouseEnter(divs[0])
      TestUtils.Simulate.focus(input)
      TestUtils.Simulate.keyDown(input, {key: 'Enter'})
      expect(component.state.list.size).to.equal(0)
      expect(component.state.highlighted).to.equal(0)
      expect(component.state.selected).to.equal(undefined)
      expect(component.state.search).to.equal('')
    })

    it ('should trigger custom propTypes warning when passing invalid proptypes', () => {
      //data propType
      let component = TestUtils.renderIntoDocument(<DataSelect  data={7}
                                                            onChange={onChange}
                                                            listField={{fields: ['firstName', 'lastName']}} />)
      expect(console.error.callCount).to.equal(1)
      expect(console.error.calledWith('Warning: Failed propType: Invalid prop `data` supplied to `DataSelect`. Validation failed.')).to.be.true

      //listField propType
      component = TestUtils.renderIntoDocument(<DataSelect  data={Immutabledata}
                                                            onChange={onChange}
                                                            listField={7} />)
      expect(console.error.callCount).to.equal(2)
      expect(console.error.calledWith('Warning: Failed propType: Invalid prop `listField` supplied to `DataSelect`. Validation failed.')).to.be.true
    })

})

class Parent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: Immutable.List()
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: nextProps.data})
  }

  render() {
    return (
      <DataSelect ref={(c) => this.dataSelect = c} data={this.state.data}
                  onChange={this.props.onChange}
                  listField={{fields: ['firstName', 'lastName']}} />
    )
  }
}
