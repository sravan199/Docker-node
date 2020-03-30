
// require('@babel/register');
// var express = require('express');

//test
require('dotenv').config();
const process = require('process');
import express from 'express';
import bodyParser from 'body-parser';
import Boom from 'express-boom';
import { Router } from './routes';
import { LogMiddleware, Log } from './services';
import cors from 'cors';

export class backendService {
    createApp() {
        const app = express();
        app.set('HEALTH_STATUS', 'INITIALIZING');
        app.use(bodyParser.json());
        app.use(Boom());
        app.use(LogMiddleware);
        app.use(cors());
        Router.build(app);

        return app;
    }

    init() {
        Log.info('Initializing pyxis-app');
        this.app = this.createApp();
        const {
            PORT,
            NODE_environment
        } = process.env;

        // ENV Argument Checks
        if (!PORT || !NODE_environment) {
            const msg =
                'Configuration Error: you must specify these ENV variables: PORT, NODE_environment';
            Log.error(msg);
            throw new Error(msg);
        }

        this.port = PORT;
        this.env = NODE_environment;
    }
    async start() {
        this.init();
        const DOCKER_HOST = '0.0.0.0';

        const server = this.app.listen(this.port, DOCKER_HOST, err => {
            if (err) {
                this.app.set('HEALTH_STATUS', 'SERVER_LISTEN_FAILED');
                throw err;
            }

            Log.info(`Server started on http://${DOCKER_HOST}:${this.port}`);
        });

        // if (!this.esMigrated) {
        //   await this.initESMigrations();
        // }
        // if (!this.dbBootstraped) {
        //   await this.initDB();
        // }

        if (
            this.env === 'development' ||
            this.env === 'testing' ||
            this.env === 'test'
        ) {
            process.env.isAppReadyForTest = true;
        }

        this.app.set('HEALTH_STATUS', 'READY');
        Log.info('Initialization successful. Service is Ready.');

        // Shutdown Hook
        process.on('SIGTERM', () => {
            this.stop(server);
        });
        process.on('unhandledRejection', e => {
            Log.child({
                message: e.message,
                stack: e.stack
            }).error('Error due to unhandledRejection.');
        });
        return Promise.resolve();
    }
    stop(server) {
        Log.info('Starting graceful shutdown...');
        this.app.set('HEALTH_STATUS', 'SHUTTING_DOWN');

        //LoadingDock.readShutdown();

        setTimeout(() => {
            server.close(() => {
                Log.info('Shutdown Complete.');
                process.exit(0);
            });
        }, 3000);
    }
}

export const Server = new backendService();
// Start the service when run from command line
if (
    (process.env.NODE_environment === 'production' ||
        process.env.NODE_environment === 'development')
) {
    Log.info('pyxis-app: Server started');
    Server.start();
} else {
    Log.error('pyxis-app: Server not started.');
}
