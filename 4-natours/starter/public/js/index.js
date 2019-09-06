/* eslint-disable */

import '@babel/polyfill'
import login from './login'
import logout from './logout'
import displayMap from './mapbox'

// DOM ELEMENTS
const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form')
const logoutBtn = document.querySelector('.nav__el--logout')

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations)
  displayMap(locations)
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    e.preventDefault()
    login(email, password)
  })
}

if (logoutBtn) logoutBtn.addEventListener('click', logout)
