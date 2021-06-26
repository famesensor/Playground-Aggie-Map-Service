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
import { mapInterface, plan, StatusUnit } from '../models/maps';

// error reponse
import { ErrorReponse } from '../utils/error/errorReponse';

const gwavDatabase = db.collection('gwav');
const soilDatabase = db.collection('soil');
const hidoDatabase = db.collection('hido');
const planDatabase = db.collection('plan');
const FieldValue = admin.firestore.FieldValue;

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

        let hidoUnit: string = '',
            gwavUnit: string = '',
            soliUnit: string = '';
        const hidoRef = await hidoDatabase.orderBy('x_max', 'desc').get();
        for (let ele of hidoRef.docs) {
            const data = ele.data();
            if (
                body.location.lat <= data.x_max &&
                body.location.lat >= data.x_min
            ) {
                if (
                    body.location.lng <= data.y_man &&
                    body.location.lng >= data.y_min
                ) {
                    hidoUnit = data.unit;
                    break;
                } else {
                    continue;
                }
            } else {
                continue;
            }
        }

        const gwavRef = await gwavDatabase.orderBy('x_max', 'desc').get();
        for (let ele of gwavRef.docs) {
            const data = ele.data();
            if (
                body.location.lat <= data.x_max &&
                body.location.lat >= data.x_min
            ) {
                if (
                    body.location.lng <= data.y_man &&
                    body.location.lng >= data.y_min
                ) {
                    gwavUnit = data.unit;
                    break;
                } else {
                    continue;
                }
            } else {
                continue;
            }
        }

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
                    soliUnit = data.unit;
                    break;
                } else {
                    continue;
                }
            } else {
                continue;
            }
        }

        try {
            let unit = compareUnit(gwavUnit, hidoUnit, soliUnit);
            let uid = uuidGen('plan');
            let data: plan = {
                plan_id: uid,
                plan_name: body.plan_name,
                address: body.address,
                location: {
                    lat: body.location.lat,
                    lng: body.location.lng
                },
                unit: unit,
                soilUnit: soliUnit,
                hidoUnit: getTranslationHidoToValue(hidoUnit),
                gwavUnit: getTranslationGwavToValue(gwavUnit),
                create_by: req.user?.user_id,
                update_by: req.user?.user_id,
                create_date: FieldValue.serverTimestamp(),
                update_date: FieldValue.serverTimestamp()
            };

            const planRef = await planDatabase.doc(uid).set(data);
        } catch (error) {
            return next(new ErrorReponse('Internal server error', 500));
        }
        res.status(201).json({ message: 'success' });
    }
);

// gat plan list...
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

// get plan by id...
export const GetPlan = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const planId = req.params.planId;

        const planRef = await planDatabase.doc(planId).get();
        if (!planRef.exists) return next(new ErrorReponse('not found', 404));

        res.status(200).json({
            message: 'success',
            data: planRef.data()
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

const getTranslationHidoToValue = (unit: string): string => {
    const valueHido = {
        TRc: 'ชั้นหินอุ้มน้ำหินคาร์บอเนตอายุไทรแอสซิก',
        Pcms: 'ชั้นหินอุ้มน้ำหินชั้นกึ่งแปรอายุเพอร์เมียน คาร์บอนิเฟอรัส',
        Qbs: 'ชั้นหินอุ้มน้ำตะกอนทรายชายหาด',
        PEmm: 'ชั้นหินอุ้มน้ำหินแปรอายุพรีแคมเบียน',
        Qcl: 'ชั้นหินอุ้มน้ำตะกอนเศษหินเชิงเขา',
        Qfd: 'ชั้นหินอุ้มน้ำตะกอนน้ำพา',
        SDmm: 'ชั้นน้ำหินแปรอายุไซลูเรียน-ดีโวเนียน',
        TRms: 'ชั้นหินอุ้มน้ำหินชั้นกึ่งแปรยุคใหม่',
        Vc: 'ชั้นหินอุ้มน้ำหินภูเขาไฟ',
        Gr: 'ชั้นหินอุ้มน้ำหินแกรนิต',
        Pc: 'ชั้นหินอุ้มน้ำหินคาร์บอเนตอายุเพอร์เมียน'
    }[unit];

    return valueHido ?? 'ไม่มีข้อมูล';
};

const getTranslationGwavToValue = (uint: string): string => {
    const valueGwav = {
        B3: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้ต้องมีค่าน้อยกว่า 500 มิลลิกรัมต่อลิตร ปริมาณนํ้าที่คาดว่าจะพัฒนาได้ 10-20 ลูกบาศก์เมตรต่อชั่วโมง',
        B4: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้ต้องมีค่าน้อยกว่า 500 มิลลิกรัมต่อลิตร ปริมาณนํ้าที่คาดว่าจะพัฒนาได้ 10-20 ลูกบาศก์เมตรต่อชั่วโมง',
        B1: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้ต้องมีค่าน้อยกว่า 500 มิลลิกรัมต่อลิตร ปริมาณนํ้าที่คาดว่าจะพัฒนาได้น้อยกว่า 2 ลูกบาศก์เมตรต่อชั่วโมง',
        B2: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้ต้องมีค่าน้อยกว่า 500 มิลลิกรัมต่อลิตร ปริมาณนํ้าที่คาดว่าจะพัฒนาได้ 2-10 ลูกบาศก์เมตรต่อชั่วโมง',
        G3: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้มีค่า 500-1500 มิลลิกรัมต่อลิตร ปริมาณนํ้าที่คาดว่าจะพัฒนาได้ 10-20 ลูกบาศก์เมตรต่อชั่วโมง',
        G4: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้มีค่า 500-1500 มิลลิกรัมต่อลิตร ปริมาณนํ้าที่คาดว่าจะพัฒนาได้มากกว่า 20 ลูกบาศก์เมตรต่อชั่วโมง',
        G1: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้มีค่า 500-1500 มิลลิกรัมต่อลิตร ปริมาณนํ้าที่คาดว่าจะพัฒนาได้น้อยกว่า 2 ลูกบาศก์เมตรต่อชั่วโมง',
        G2: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้มีค่า 500-1500 มิลลิกรัมต่อลิตร ปริมาณนํ้าที่คาดว่าจะพัฒนาได้ 2-10 ลูกบาศก์เมตรต่อชั่วโมง',
        R1: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้มีค่ามากกว่า 1500 มิลลิกรัมต่อลิตร',
        R2: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้มีค่ามากกว่า 1500 มิลลิกรัมต่อลิตร',
        R3: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้มีค่ามากกว่า 1500 มิลลิกรัมต่อลิตร',
        R4: 'คุณภาพนํ้าบาดาลปริมาณมวลสารทั้งหมดที่ละลายนํ้าได้มีค่ามากกว่า 1500 มิลลิกรัมต่อลิตร'
    }[uint];

    return valueGwav ?? 'ไม่มีข้อมูล';
};

const getTranslationMapGwav = (unit: string) => {
    const unitsGwav = {
        B3: 10,
        B4: 10,
        B1: 8,
        B2: 8,
        G3: 6.5,
        G4: 6.5,
        G1: 5,
        G2: 5,
        R1: 3,
        R2: 3,
        R3: 3,
        R4: 3
    }[unit];
    let res = unitsGwav ?? 0;
    return res * 2.5;
};

const getTranslationMapHido = (unit: string) => {
    const unitsHido = {
        TRc: 10,
        Pcms: 8,
        Qbs: 8,
        PEmm: 8,
        Qcl: 8,
        Qfd: 8,
        SDmm: 8,
        TRms: 8,
        Vc: 8,
        Gr: 6.5,
        Pc: 6.5
    }[unit];
    let res = unitsHido ?? 0;
    return res * 2.5;
};

const getTranslationMapSoil = (unit: string) => {
    const unitsSoil = {
        '43': 10,
        '62': 10,
        '26': 8,
        '29': 8,
        '32': 8,
        '34': 8,
        '35': 8,
        '37': 8,
        '39': 8,
        '40': 8,
        '45': 8,
        '46': 8,
        '48': 8,
        '49': 8,
        '50': 8,
        '51': 8,
        '53': 8,
        '56': 8,
        '60': 8,
        '7': 5,
        '24': 5,
        '42': 5,
        '2': 2,
        '3': 2,
        '6': 2,
        '11': 2,
        '12': 2,
        '13': 2,
        '14': 2,
        '16': 2,
        '17': 2,
        '18': 2,
        '22': 2,
        '23': 2,
        '25': 2,
        '59': 2
    }[unit];
    let res = unitsSoil ?? 0;

    return res * 3;
};

const getTranslationMapSlop = (unit: string): number => {
    const unitsSlop = {
        A: 20,
        B: 20,
        C: 20,
        D: 16,
        E: 13
    }[unit];

    return unitsSlop ?? 20;
};

const getTranslationUnit = (index: number): string => {
    const unitIndex = {
        0: `ศักยภาพน้ำบาดาล`,
        1: `ชั้นหินอุ้มน้ำ`,
        2: `ชุดดิน`
    }[index];

    return unitIndex!;
};

const compareUnit = (
    gwavUnit: string,
    hidoUnit: string,
    soliUnit: string
): string => {
    let unitGwav = getTranslationMapGwav(gwavUnit),
        unitHido = getTranslationMapHido(hidoUnit),
        unitSoil = splitSoil(soliUnit),
        sum = unitGwav + unitHido + unitSoil,
        resultUnit = [unitGwav, unitHido, unitSoil],
        unit: string = '';

    if (sum < 50) {
        let value = Math.min(...resultUnit),
            word = '',
            index = -1;
        if (value === 0) {
            word = `ไม่มีข้อมูล`;
        } else {
            word = `ไม่มีคุณภาพเพียงพอจะทำธนาคารน้ำใต้ดิน`;
        }
        index = resultUnit.indexOf(value);
        unit = getTranslationUnit(index);
        unit = `${StatusUnit.LessAppropriate} เพราะ ${unit} ${word}`;
    } else if (sum < 65) {
        unit = StatusUnit.Inappropriate;
    } else if (sum < 85) {
        unit = StatusUnit.Appropriate;
    } else {
        unit = StatusUnit.VeryAppropriate;
    }

    return unit;
};

const splitSoil = (unit: string) => {
    let res: number[] = [];
    let temp = unit.split('/');
    for (let ele of temp) {
        let output = ele.replace(/\'/g, '').split(/(\d+)/).filter(Boolean);
        let soil = getTranslationMapSoil(output[0]);
        let sym = getTranslationMapSlop(output[1]);
        res.push(soil + sym);
    }

    return res.length === 2 ? Math.min(...res) : res[0];
};
