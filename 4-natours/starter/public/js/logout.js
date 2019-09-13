/* eslint-disable */

import axios from 'axios'
import showAlert from './alerts'

const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully!')
      location.reload(true)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export default logout
