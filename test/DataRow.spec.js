import { expect } from 'chai'
import React from 'react'
import TestUtils from 'react-addons-test-utils'
import sinon from 'sinon'
import DataRow from '../src/DataRow'
import { fakeImmutableData as data } from './helpers/data'

describe('DataRow', () => {
  let props, handleClick

  beforeEach('instantiate DataRow component instance', () => {
    handleClick = sinon.spy((index) => {
      return index
    })

    props = { data: data, rowIndex: 0, highlighted: 1, handleClick: handleClick, listField: 'firstName' }
  })

  it ('should render with text from passed data', () => {
    let component = TestUtils.renderIntoDocument(<DataRow {...props} />)
    let row = TestUtils.findRenderedDOMComponentWithTag(component, "div")

    expect(row.className).to.equal('data-row')
    expect(row.innerHTML).to.equal('Darth')
  })

  it ('should have active class if it is the selected row', () => {
    let component = TestUtils.renderIntoDocument(<DataRow {...props} highlighted={0} />)
    let row = TestUtils.findRenderedDOMComponentWithTag(component, "div")

    expect(row.className).to.equal('data-select-active data-row')
  })

  it ('should call the passed function when clicked', () => {
    let component = TestUtils.renderIntoDocument(<DataRow {...props} />)
    let row = TestUtils.findRenderedDOMComponentWithTag(component, "div")

    TestUtils.Simulate.click(row)

    expect(handleClick.callCount).to.equal(1)
    expect(handleClick.returnValues).to.deep.equal([0])
  })

})
