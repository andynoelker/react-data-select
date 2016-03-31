import { expect } from 'chai'
import hasClass from '../../src/utils/hasClass'

describe('hasClass', () => {
  let div = document.createElement('div')

  it('should detect if element contains class', () => {
    div.className = "jedi"
    expect(hasClass(div, 'jedi')).to.be.true
  })

  it('should detect if element does not contain class', () => {
    div.className = ""
    expect(hasClass(div, 'jedi')).to.be.false
  })

  it('should detect if element with multiple classes contains class', () => {
    div.className = "sith jedi bountyHunters"
    expect(hasClass(div, 'jedi')).to.be.true
  })

})
