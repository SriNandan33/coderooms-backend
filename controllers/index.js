const router = require('express').Router()

router.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

module.exports = router
