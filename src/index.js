const express = require('express')

const app = express()


app.listen(3000, () => {
  global.console.log('localhost:3000')
})