import { Router } from 'express';

import {
    GetSoils,
    GetStone,
    GetWaters,
    CraetePlan,
    GetPlanList,
    GetPlan
} from '../controllers/maps';
import { protect } from '../middlewares/auth';
const rotuer = Router();

rotuer.route('/soils').get(protect, GetSoils);

rotuer.route('/stones').get(protect, GetStone);

rotuer.route('/waters').get(protect, GetWaters);

rotuer.route('/plan').post(protect, CraetePlan).get(protect, GetPlanList);

rotuer.route('/plan/:planId').get(protect, GetPlan);

export default rotuer;
