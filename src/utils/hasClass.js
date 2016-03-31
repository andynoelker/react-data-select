export default function hasClass(el, selector) {
  let className = " " + selector + " "

  if ((" " + el.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1) {
    return true
  } else {
    return false
  }
}
