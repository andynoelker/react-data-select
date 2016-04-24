# React Data Select

An autocomplete Select box for data objects that only renders what you see. Handles thousands of rows of data lightning fast. It's like if Fixed Data Table and Selectize had a baby.

## Usage

React-Data-Select builds a searchable list from an array of objects or strings passed into its `data` property. It also can be passed a listener for the `onChange` event.

```
import DataSelect from 'react-data-select'

const data = ['apples', 'oranges', 'peaches', 'lemons']

handleChange(val) {
  console.log('Currently selected: ' + val.text)
}

<DataSelect data={data} onChange={handleChange} />
```

A major strength of React-Data-Select is that does not just search strings - it is a Select box for objects! If you pass it an array of objects, you also need to provide a `listField` property to provide which field in the object is the text that will be listed and searchable. The object that is returned to the `onChange` handler contains both a `text` property, which always contains a string of the listed text in the input, and a `selected` property, which contains the entire object that has been selected.

```
import DataSelect from 'react-data-select'

const data = [
                { name: 'apple', type: 'fruit' },
                { name: 'salmon', type: 'fish' },
                { name: 'peanut butter', type: 'amazing' },
              ]

handleChange(val) {
  console.log('Currently selected: ' + val.selected) //shows whole object
}

<DataSelect data={data} onChange={handleChange} listField="name" />
```

## Future

This project is in *extreme* infancy right now. The most urgent steps for the future of this project are:

* **React 15 support.** This project is built around Facebook's Fixed Data Table project which [might be abandoned](https://github.com/facebook/fixed-data-table/issues/364). If that project cannot support React 15 then this project will either need to use an updated fork, a new dependency that delivers the same results, or build that functionality fully.
* **Multiselect** This is the next big feature planned for this project.
* **Improved styling** Right now the component only has one style and there are some hackish overrides of Fixed Data Table's styles. Need a better system that is easier for developers to modify.

# License

MIT Licensed. Copyright (c) Andy Noelker 2016.
