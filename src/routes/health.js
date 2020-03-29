import { Router, response } from 'express';
const router = new Router();

router.get('/', (req, res) => {

    // res.set('Content-Type', 'text/plain');
    const status = req.app.get('HEALTH_STATUS');
    let response = {
        status: `${status} sravan reddy`
    }
    return res.send(response);
});

module.exports = router;
