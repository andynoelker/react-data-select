import { expect } from 'chai'
import React from 'react'
import { Component } from 'react'
import TestUtils from 'react-addons-test-utils'
import sinon from 'sinon'
import DataSelect from '../src/DataSelect'
import Immutable from 'immutable'
import { fakeImmutableData as data } from './helpers/data'

describe('DataSelect', () => {
    let component, divs, input, handleChange

    beforeEach('instantiate DataSelect instance', () => {
      handleChange = sinon.spy((e) => {
        return 'changed'
      })

      component = TestUtils.renderIntoDocument(<DataSelect  data={data}
                                                            handleChange={handleChange}
                                                            listField={{fields: ['firstName', 'lastName']}} />)
      divs = TestUtils.scryRenderedDOMComponentsWithTag(component, "div")
      input = TestUtils.findRenderedDOMComponentWithTag(component, "input")
    })

    it ('should render with correct data', () => {
      expect(divs[0].className).to.equal('data-select')
      expect(component.state.list.size).to.equal(12)
      expect(component.state.list.getIn([0, 'firstName'])).to.equal('Darth')
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
                                                            handleChange={handleChange}
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

})
