import { expect } from 'chai'
import getListFieldText from '../../src/utils/getListFieldText'
import { fakeImmutableData as data } from '../helpers/data'

describe('getListFieldText', () => {
    it ('should return the passed in data when that data is a string', () => {
      expect(getListFieldText(data.getIn([0, 'firstName']))).to.equal('Darth')
    })

    it ('should return a single field when listField is a string', () => {
        expect(getListFieldText(data.get(0), 'lastName')).to.equal('Vader')
    })

    it ('should return multiple concatenated fields when listField is an object with array property', () => {
      expect(getListFieldText(data.get(0), {fields: ['firstName', 'lastName']})).to.equal('Darth Vader')
    })

    it ('should use a custom connector when concatenating multiple fields', () => {
      expect(getListFieldText(data.get(0), {fields: ['firstName', 'lastName'], connector: '-'}))
              .to.equal('Darth-Vader')
    })

    it ('should throw Errors when listField is not a string or properly formatted object', () => {
      expect(() => getListFieldText(data.get(0), ['firstName', 'lastName'])).to.throw(Error)
      expect(() => getListFieldText(data.get(0), {fields: 0})).to.throw(Error)
      expect(() => getListFieldText(data.get(0), {fields: [0, 1]})).to.throw(Error)
    })
})
