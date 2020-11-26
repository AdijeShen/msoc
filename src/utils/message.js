import { MessageBox, Message } from 'element-ui'

export function showError(msg) {
  Message({
    message: msg,
    type: 'error',
    duration: 2 * 1000
  })
}

export function showSuccess(msg) {
  Message({
    message: msg,
    type: 'success',
    duration: 2 * 1000
  })
}