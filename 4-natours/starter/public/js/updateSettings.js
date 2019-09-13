/* eslint-disable */

import axios from 'axios'
import showAlert from './alerts'

// type is either 'password' or 'data'
const updateSettings = async (data, type) => {
  try {
    const endpoint = type === 'password' ? '/updateMyPassword' : '/updateMe'

    const res = await axios({
      method: 'PATCH',
      url: `http://localhost:3000/api/v1/users/${endpoint}`,
      data,
    })

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`)
      window.setTimeout(() => {
        location.reload(true)
      }, 1500)
    }
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}

export default updateSettings