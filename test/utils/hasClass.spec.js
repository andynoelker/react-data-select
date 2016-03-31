import { expect } from 'chai'
import hasClass from '../../src/utils/hasClass'

describe('hasClass', () => {
  let div = document.createElement('div')

  it('should detect if element contains class', () => {
    div.className = "myClass"
    expect(hasClass(div, 'myClass')).to.equal(true)
  })

  it('should detect if element does not contain class', () => {
    div.className = ""
    expect(hasClass(div, 'myClass')).to.equal(false)
  })

  it('should detect if element with multiple classes contains class', () => {
    div.className = "extra myClass somethingElse"
    expect(hasClass(div, 'myClass')).to.equal(true)
  })

})
