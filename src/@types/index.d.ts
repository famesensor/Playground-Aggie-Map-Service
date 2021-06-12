import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                user_id: string;
            };
        }
    }
}

// declare module 'express' {
//     export interface Request extends Request {
//         user?: {
//             user_id: string;
//         };
//     }
// }
