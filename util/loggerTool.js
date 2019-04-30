
const winston = require('winston')
const moment = require('moment')
require('winston-daily-rotate-file')

const env = require('./../.env')

// log('service', 'info', `Info...`)
// log('service', 'error', `Error...`)

const transports = [
    new winston.transports.DailyRotateFile({
        level: 'info',
        name: 'logs',
        filename: env.logdir + 'access%DATE%.log',
        maxSize: '1000k',
        maxFiles: '15d',
        zippedArchive: false
    }),
    new winston.transports.DailyRotateFile({
        level: 'error',
        name: 'logs',
        filename: env.logdir + 'error%DATE%.log',
        maxSize: '1000k',
        maxFiles: '15d',
        zippedArchive: false
    }),
    new winston.transports.Console({
        colorize: true
    })
]

const logger = winston.createLogger({
    transports: transports
})

const log = async (service, level, msg) => {
    logger.log({
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSSS'),
        service: service,
        level: level,
        message: msg
    })
}   // end infoLog


module.exports = { log }
