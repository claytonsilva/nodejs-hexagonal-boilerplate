/**
 * Module dependencies.
 */
import { app } from '../index'
import http from 'http'
const debug = require('debug')('api-server')

/**
 * @description Get the start message default with the port.
 *
 * @memberof http
 * @param {number} port
 * @returns {string}
 */
const startMessageDefault = (port) => {
  return `The magic is on port ${port}`
}

/**
 * Event listener for HTTP server "listening" event.
 *
 * @memberof http
 * @returns {undefined}
 */
const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
  debug('Listening on ' + bind)
}

/**
 * @description Normalize a port into a number, string, or false.
 *
 * @memberof http
 * @param {string} value Port number as string type.
 * @returns {number}
 */
const normalizePort = (value) => {
  const port = parseInt(value, 10)
  return isNaN(port) ? value : port >= 0 ? port : false
}

/**
 * Event listener for HTTP server "error" event.
 * @memberof http
 * @param {Error} error instantiated
 */
const onError = (error) => {
  if (error.syscall !== 'listen') throw error

  const bind = `${typeof port === 'string' ? 'Pipe' : 'Port'} ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Get port from environment and store in Express.
 * @memberof http
 */
const port = normalizePort(process.env.PORT || '3000')
console.log(`${process.env.START_MESSAGE || startMessageDefault(port)}`)
app.set('port', port)

/**
 * Create HTTP server.
 * @memberof http
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
