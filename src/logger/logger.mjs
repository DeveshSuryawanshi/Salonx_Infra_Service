import { createLogger, format, transports, addColors } from 'winston';
import path from 'path';
import fs from 'fs';
import config from '../config/config.mjs';

const customLevels = {
  levels: {
    fatal: 0, // Highest priority
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5, // Lowest priority
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'cyan',
    debug: 'blue',
  },
};

// Add the custom colors to Winston
addColors(customLevels.colors);

// Conditional logic for log directory and file transport
let transportsArray = [];

// Development environment setup
if (config.app.nodeEnv === 'development') {
  const logsDir = path.resolve('logs');

  // Ensure the logs directory exists
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  const logFilePath = path.join(logsDir, 'application.log');

  // Add file transport for development
  transportsArray.push(
    new transports.File({
      filename: logFilePath,
      level: 'info', // Log only info and higher levels to file
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
    })
  );
}

// Add console transport for all environments
transportsArray.push(
  new transports.Console({
    level: config.app.nodeEnv === 'development' ? 'debug' : 'info', // Debug in dev, info in prod
    format: format.combine(
      // format.colorize({ all: true }), // Apply colorization only in the console
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    ),
  })
);

// Create a Winston logger
export const Logger = createLogger({
  levels: customLevels.levels,
  level: 'info', // Minimum level to log
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: transportsArray,
});

// Middleware for logging HTTP requests
export const requestLogger = (req, res, next) => {
  const { method, url } = req;
  const startTime = new Date();

  res.on('finish', () => {
    const { statusCode } = res;
    const responseTime = new Date() - startTime;
    Logger.info(`[${method}] ${url} ${statusCode} - ${responseTime}ms`);
  });

  next();
};


// Usage
// Logger.fatal('This is a fatal log'); // Highest priority
// Logger.error('This is an error log');
// Logger.warn('This is a warning log');
// Logger.info('This is an info log');
// Logger.http('This is an HTTP log');
// Logger.debug('This is a debug log'); // Lowest priority
