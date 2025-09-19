import { Router } from 'express';
import { SomeController } from '../controllers/index';

const router = Router();

router.get('/some-endpoint', SomeController.someMethod);
router.post('/another-endpoint', SomeController.anotherMethod);

export default (app) => {
    app.use('/api', router);
};