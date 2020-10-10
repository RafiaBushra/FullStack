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

export const setNotification = (notification, timer) => {
  return async (dispatch) => {
    dispatch({
      type: 'NOTIFY',
      data: notification
    })
    setTimeout(() => {
      dispatch(clearNotification())
    }, timer * 1000)

  }
}

export default notificationReducer