import { Router } from 'express';

import { signUp } from '../controllers/auth';

const router = Router();

router.route('/signup').post(signUp);

export default router;
