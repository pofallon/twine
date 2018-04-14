const EventEmitter = require('events')

class BatchEmitter extends EventEmitter {
  constructor (size) {
    super()
    this.batchSize = size
    this.items = []
  }
  add (item) {
    this.items.push(item)
    if (this.items.length === this.batchSize) {
      let data = this.items
      this.items = []
      this.emit('data', data)
    }
  }
  done () {
    this.emit('data', this.items)
    process.nextTick(() => {
      this.emit('end')
    })
  }
}

module.exports = BatchEmitter
