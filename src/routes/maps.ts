import { Router } from 'express';

import {
    GetSoils,
    GetStone,
    GetWaters,
    InsertWaters
} from '../controllers/maps';
import { protect } from '../middlewares/auth';
const rotuer = Router();

rotuer.route('/soils').get(protect, GetSoils);

rotuer.route('/stones').get(protect, GetStone);

rotuer.route('/waters').get(protect, GetWaters);

rotuer.route('/insert-water').post(protect, InsertWaters);

export default rotuer;
