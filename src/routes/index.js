import fs from 'fs';
import { LogMiddleware, Log } from '../services'
export const Router = {
    build(app) {
        const routes = fs.readdirSync(__dirname)
            .filter(file => file !== 'index.js')
            .filter(file => file.match(/^(?!.*\.test\.js$).*\.js$/))
            .map(file => file.split('.')[0]);

        routes.forEach(route => {
            app.use(`/${route}`, this.importSubRouter(`./${route}.js`));
            // let temp = this.importSubRouter(`./${route}.js`);
            // Log.info(temp);
            // app.use(`/${route}`, temp);
        });
    },
    importSubRouter(filePath) {
        return require(filePath);
    }
};
