import { expect } from 'chai'
import React from 'react'
import { Component } from 'react'
import TestUtils from 'react-addons-test-utils'
import sinon from 'sinon'
import InputHeader from '../src/InputHeader'

describe('InputHeader', () => {
    let component, input, parent, searchChange, handleKeyPress, handleFocus, handleBlur

    beforeEach('instantiate InputHeader instance', () => {
      searchChange = sinon.spy((search) => {
        return search.target.value
      })

      handleKeyPress = sinon.spy((e) => {
        return e.key
      })

      handleFocus = sinon.spy(() => {
        return 'focused'
      })

      handleBlur = sinon.spy(() => {
        return 'blurred'
      })

      component = TestUtils.renderIntoDocument(<InputHeader search="Hoth"
                                                            searchChange={searchChange}
                                                            handleKeyPress={handleKeyPress}
                                                            handleFocus={handleFocus}
                                                            handleBlur={handleBlur} />)
      input = TestUtils.findRenderedDOMComponentWithTag(component, "input")
    })

    it ('should render with search text', () => {
      let wrapper = TestUtils.findRenderedDOMComponentWithTag(component, "div")

      expect(input.className).to.equal('search-field')
      expect(input.value).to.equal('Hoth')
      expect(input.placeholder).to.equal('Enter search term...')
    })

    it ('should handle focus and blur calls', () => {
      TestUtils.Simulate.focus(input)
      expect(handleFocus.callCount).to.equal(1)
      expect(handleFocus.returnValues[0]).to.equal('focused')

      TestUtils.Simulate.blur(input)
      expect(handleBlur.callCount).to.equal(1)
      expect(handleBlur.returnValues[0]).to.equal('blurred')
    })

    it ('should handle key presses', () => {
      TestUtils.Simulate.keyDown(input, {key: 'a'})
      expect(handleKeyPress.callCount).to.equal(1)
      expect(handleKeyPress.returnValues[0]).to.equal('a')
    })

    it ('should handle search change', () => {
      TestUtils.Simulate.change(input, {target: {value: 'Sith'}})
      expect(searchChange.callCount).to.equal(1)
      expect(searchChange.returnValues[0]).to.equal('Sith')
    })

    it ('should use placeholder text from props', () => {
      component = TestUtils.renderIntoDocument(<InputHeader search="Hoth"
                                                            placeholder="Search for Star Wars reference..."
                                                            searchChange={searchChange}
                                                            handleKeyPress={handleKeyPress}
                                                            handleFocus={handleFocus}
                                                            handleBlur={handleBlur} />)
      input = TestUtils.findRenderedDOMComponentWithTag(component, "input")

      expect(input.placeholder).to.equal('Search for Star Wars reference...')
    })
})
