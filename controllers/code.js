const axios = require('axios')
const querystring = require('querystring')
const codeRouter = require('express').Router()

const RUN_URL = 'https://api.hackerearth.com/v3/code/run/'

codeRouter.post('/run', async (request, response) => {
  const source = request.body.code
  let language = request.body.language
  if (language === 'javascript') {
    language = 'javascript_node'
  }
  const run_data = {
    client_secret: process.env.HE_SECRET_KEY,
    async: 0,
    source: source,
    lang: language.toUpperCase(),
    time_limit: 5,
    memory_limit: 262144,
  }
  try {
    const heResponse = await axios.post(
      RUN_URL,
      querystring.stringify(run_data)
    )
    response.send(heResponse.data)
  } catch (err) {
    response
      .status(400)
      .send({ status: 'error', message: 'failed to run code!' })
  }
})
module.exports = codeRouter
