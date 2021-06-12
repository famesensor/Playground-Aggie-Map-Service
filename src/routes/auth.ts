import { Router } from 'express';

import { signIn, signUp } from '../controllers/auth';
import { protect } from '../middlewares/auth';

const router = Router();

router.route('/signup').post(signUp);
router.route('/signin').post(signIn);

router.route('/healthz').get(protect, (req, res, next) => {
    res.status(200).json({ message: 'success' });
});

export default router;
