import { Request, Response, NextFunction } from 'express';
import csv from 'neat-csv';
import fs from 'fs';

// database...
import { admin, db } from '../configs/firebase.config';

// handler...
import { asyncHandler } from '../middlewares/asyncHandler';

// uuidgen
import { uuidGen } from '../utils/uidgen/uidgen';

// validate...
import { createPlanValidate } from '../utils/validation/index';

// interface...
import { mapInterface, plan } from '../models/maps';

// error reponse
import { ErrorReponse } from '../utils/error/errorReponse';

const gwavDatabase = db.collection('gwav');
const soilDatabase = db.collection('soil');
const hidoDatabase = db.collection('hido');
const planDatabase = db.collection('plan');

// get waters...
export const GetWaters = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const waters = await gwavDatabase.get();

        let watersList: mapInterface[] = [];
        for (let ele of waters.docs) {
            const data = ele.data();
            const temp: mapInterface = {
                Id: data.mapId,
                unit: data.unit,
                polyName: data.polyName,
                locations: data.locations
            };
            watersList.push(temp);
        }

        res.status(200).json({
            message: 'success',
            data: {
                waters: watersList
            }
        });
    }
);

// get soils...
export const GetSoils = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const soils = await soilDatabase.get();

        let soilsList: mapInterface[] = [];
        for (let ele of soils.docs) {
            const data = ele.data();
            const temp: mapInterface = {
                Id: data.mapId,
                unit: data.unit,
                polyName: data.polyName,
                locations: data.locations
            };
            soilsList.push(temp);
        }
        res.status(200).json({
            message: 'success',
            data: {
                soils: soilsList
            }
        });
    }
);

// get stone...
export const GetStone = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const stones = await hidoDatabase.get();

        let stonesList: mapInterface[] = [];
        for (let ele of stones.docs) {
            const data = ele.data();
            const temp: mapInterface = {
                Id: data.mapId,
                unit: data.unit,
                polyName: data.polyName,
                locations: data.locations
            };
            stonesList.push(temp);
        }
        res.status(200).json({
            message: 'success',
            data: {
                stones: stonesList
            }
        });
        res.status(200).json();
    }
);

// create plan...
export const CraetePlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const body: plan = req.body;

        const { isValid, errors } = createPlanValidate(body);
        if (!isValid) {
            return next(new ErrorReponse('Validate Error', 400, errors));
        }

        // const hidoRef = await hidoDatabase.orderBy('x_max', 'desc').get();
        // for (let ele of hidoRef.docs) {
        //     const data = ele.data();
        //     if (
        //         body.location.lat <= data.x_max &&
        //         body.location.lat >= data.x_min
        //     ) {
        //         if (
        //             body.location.lng <= data.y_man &&
        //             body.location.lng >= data.y_min
        //         ) {
        //             console.log(data);
        //              break;
        //         } else {
        //             continue;
        //         }
        //     } else {
        //         continue;
        //     }
        // }

        // const gwavRef = await gwavDatabase.orderBy('x_max', 'desc').get();
        // for (let ele of gwavRef.docs) {
        //     const data = ele.data();
        //     if (
        //         body.location.lat <= data.x_max &&
        //         body.location.lat >= data.x_min
        //     ) {
        //         if (
        //             body.location.lng <= data.y_man &&
        //             body.location.lng >= data.y_min
        //         ) {
        //             console.log(data);
        //             break;
        //         } else {
        //             continue;
        //         }
        //     } else {
        //         continue;
        //     }
        // }

        const soilRef = await soilDatabase.orderBy('x_max', 'desc').get();
        for (let ele of soilRef.docs) {
            const data = ele.data();
            if (
                body.location.lat <= data.x_max &&
                body.location.lat >= data.x_min
            ) {
                if (
                    body.location.lng <= data.y_man &&
                    body.location.lng >= data.y_min
                ) {
                    console.log(data);
                    // break;
                } else {
                    continue;
                }
            } else {
                continue;
            }
        }

        res.status(201).json({ message: 'success' });
    }
);

// gat plan list
export const GetPlanList = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.user_id;

        const planRef = await planDatabase
            .orderBy('create_date', 'desc')
            .where('create_by', '==', userId)
            .get();

        let plans: plan[] = [];
        if (!planRef.empty) {
            for (let ele of planRef.docs) {
                let data = ele.data();
                const temp: plan = {
                    plan_id: data.plan_id,
                    plan_name: data.plan_name,
                    location: {
                        lat: data.location.lat,
                        lng: data.location.lng
                    },
                    address: data.address,
                    create_date: data.create_date
                };

                plans.push(temp);
            }
        }

        res.status(200).json({
            message: 'success',
            data: {
                plan: plans
            }
        });
    }
);

// check
export const GetCheck = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const hidoRef = await db.collection('soil').get();

        console.log(hidoRef.size);
        res.status(200).json({ message: 'message' });
    }
);
