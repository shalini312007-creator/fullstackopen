
const jsonServer = require('json-server')
const cors = require('cors')

const server = jsonServer.create()
const router = jsonServer.router('./db.json')

server.use(cors())
server.use(jsonServer.defaults())
server.use(router)

server.listen(3001, '0.0.0.0', () => {
  console.log('JSON Server running on port 3001')
})
