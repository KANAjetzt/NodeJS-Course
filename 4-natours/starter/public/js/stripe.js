/* eslint-disable */
import axios from 'axios'
const stripe = Stripe('pk_test_Cr7PEltd5tqg8sarMqbr72KX00OyDUQtTX')

import showAlert from './alerts'

const bookTour = async tourID => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourID}`)

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    })
  } catch (err) {
    console.log(err)
    showAlert('error', err.response.data.message)
  }
}

export default bookTour
