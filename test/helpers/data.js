import Immutable from 'immutable'

export let fakeData = [
  {
    firstName: 'Darth',
    lastName: 'Vader',
    faction: 'Sith'
  },
  {
    firstName: 'Luke',
    lastName: 'Skywalker',
    faction: 'Jedi'
  }
]

export let fakeImmutableData = Immutable.fromJS([
  {
    firstName: 'Darth',
    lastName: 'Vader',
    faction: 'Sith'
  },
  {
    firstName: 'Luke',
    lastName: 'Skywalker',
    faction: 'Jedi'
  }
])
