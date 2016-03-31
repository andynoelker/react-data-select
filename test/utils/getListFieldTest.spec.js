import { expect } from 'chai'
import Immutable from 'immutable'
import getListFieldText from '../../src/utils/getListFieldText'
import { fakeData } from '../helpers/data'

describe('getListFieldText', () => {
    let data = Immutable.fromJS(fakeData)

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

    it ('should throw an Error when listField is not an object or a string', () => {
      expect(() => getListFieldText(data.get(0), ['firstName', 'lastName'])).to.throw(Error)
    })
})
