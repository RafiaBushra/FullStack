const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'NOTIFY':
      return action.notification
    case 'REMOVE':
      return null
    default:
      return state
  }
}

export const notify = (notification) => {
  return {
    type: 'NOTIFY',
    notification,
  }
}

export const removeNotification = () => {
  return {
    type: 'REMOVE'
  }
}

export default notificationReducer