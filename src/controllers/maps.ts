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
import {} from '../utils/validation/index';

// interface...
import { mapInterface } from '../models/maps';

// error reponse
import { ErrorReponse } from '../utils/error/errorReponse';

const waterDatabase = db.collection('water');
const soilDatabase = db.collection('soil');
const stoneDatabase = db.collection('stone');

// get waters...
export const GetWaters = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const waters = await waterDatabase.get();

        let watersList: mapInterface[] = [];
        for (let ele of waters.docs) {
            const data = ele.data();
            const temp: mapInterface = {
                mapId: data.mapId,
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
                mapId: data.mapId,
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
        const stones = await stoneDatabase.get();

        let stonesList: mapInterface[] = [];
        for (let ele of stones.docs) {
            const data = ele.data();
            const temp: mapInterface = {
                mapId: data.mapId,
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

// insert waters...
export const InsertWaters = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const raw = fs.readFileSync('./1.csv', 'utf8');

        const result = await csv(raw, { headers: false });
        const waters: mapInterface[] = [];

        for (let ele of result) {
            const uid = uuidGen('waters');
            // const temp: mapInterface = {
            //     mapId: uid,
            //     unit: ele['1'],
            //     lo
            // };
        }

        res.status(200).json({ message: 'message' });
    }
);
