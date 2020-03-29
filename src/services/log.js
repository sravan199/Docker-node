import Pino from 'express-pino-logger';

// Add Middlewares
const LogMiddleware = Pino({
    name: 'sravan'
});

const Log = LogMiddleware.logger;

export {
    LogMiddleware, Log
};
