import { defineStore } from 'pinia'

export const alertStore = defineStore('alert', {
  state: () => ({
    showAlert: false,
    messageAlert: ''
  }),
  actions: {
    setShowAlert(showAlert: boolean) {
      this.showAlert = showAlert
    },
    setMessageAlert(messageAlert: string) {
      this.messageAlert = messageAlert
    }
  }
})