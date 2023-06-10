import winston from 'winston';

const serverFormat = winston.format.printf((info) => {
  if (info instanceof Error) {
    return `${info.level} - ${info.timestamp} :: [${info.name}] ${info.message} ${info.stack}`;
  }
  return `${info.level} - ${info.timestamp} :: ${info.message}`;
});

const logger = winston.createLogger({
  level: 'info',
  levels: {
    info: 1,
    sql: 2,
    warn: 3,
    error: 4,
  },
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    serverFormat,
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
