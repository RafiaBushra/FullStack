const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.data
    case 'REMOVE':
      return null
    default:
      return state
  }
}

const clearNotification = () => {
  return {
    type: 'REMOVE'
  }
}

export const setNotification = (notification, timeout) => {
  return async (dispatch) => {
    dispatch({
      type: 'NOTIFY',
      data: notification
    })
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)

  }
}

export default notificationReducer