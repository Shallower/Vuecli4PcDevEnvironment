let addListeners = function() {
  if (this.$options.socket) {
    let conf = this.$options.socket
    if (
      !this.$socket ||
      this.$socket && this.$socket.readyState() !== WebSocket.OPEN ||
      conf.url && conf.url !== this.$socket.option.url
    ) {
      this.$store.dispatch('initSocket')
    }
    if (conf.events && this.$socket) {
      let events = conf.events
      this.$options.socket.events = new Proxy(
        {},
        {
          set: (target, key, value) => {
            this.$socket.on(key, value, this)
            target[key] = value
            return true
          },
          deleteProperty: (target, key) => {
            this.$socket.off(key, this.$options.socket.events[key], this)
            delete target.key
            return true
          }
        }
      )
      Object.keys(events).forEach(key => {
        this.$options.socket.events[key] = events[key]
      })
      events = null
    }
  }
}

let removeListeners = function() {
  if (this.$options.socket && this.$socket) {
    let conf = this.$options.socket

    if (conf.url && conf.url !== this.$socket.option.url) {
      this.$socket.close()
    }

    if (conf.events) {
      Object.keys(conf.events).forEach(key => {
        delete this.$options.socket.events[key]
      })
    }
  }
}
export default {
  created: addListeners,
  // errorCaptured: removeListeners,
  beforeDestroy: removeListeners
}
