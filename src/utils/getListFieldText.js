export default function getListFieldText(data, listField) {
  if (typeof data === 'string') {
    return data
  } else if (typeof listField === 'string') {
    return buildStringFromData(data, listField)
  } else {
    if (typeof listField.fields !== 'undefined') {
      let connector = listField.connector ? listField.connector : ' '
      return buildStringFromData(data, listField.fields, connector)
    } else {
      throw new Error('DataSelect listField must either be a string or an object')
    }
  }
}

function buildStringFromData(data, properties, connector=' ') {
  let error = 'DataSelect properties must either be a string or an array of strings'

  if (typeof properties === 'string') {
    return data.get(properties)
  } else if (Object.prototype.toString.call( properties ) === '[object Array]') {
    let string = ''

    for (let i = 0; i < properties.length; i++) {
      if (typeof properties[i] !== 'string') {
        throw new Error(error)
      }

      if (i !== 0) {
        string += connector
      }

      string += data.get(properties[i])
    }

    return string
  } else {
    throw new Error(error)
  }
}
