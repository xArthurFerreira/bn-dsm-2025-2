#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js'
import chalk from 'chalk'
import { createServer } from 'http'
import fs from 'fs'
import path from 'path'

// Carrega variáveis do arquivo .env (simples, sem dependência externa)
try {
  const envPath = path.resolve(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (match) {
        const key = match[1]
        let val = match[2] || ''
        // remove surrounding quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1)
        }
        if (!process.env[key]) process.env[key] = val
      }
    })
  }
} catch (e) {
  // não bloqueante: se algo falhar, continuará e o Prisma logará erro
  console.error('Erro ao carregar .env:', e)
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '8080')
app.set('port', port)

/**
 * Create HTTP server.
 */

const server = createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`)
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`)
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address()
  let bind = typeof addr === 'string' ? `pipe  ${addr}` : `port ${addr.port}`
  console.log(chalk.cyan(`Listening on ${bind}.`))
}
