/* eslint-disable */

const hideAlert = () => {
  const el = document.querySelector('.alert')
  if (el) el.remove()
}

// type is 'success' or 'error'
const showAlert = (type, msg) => {
  hideAlert()
  const markup = `<div class="alert alert--${type}">${msg}</div>`
  console.log(markup, document.querySelector('body'))
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup)

  window.setTimeout(hideAlert, 5000)
}

export default showAlert
