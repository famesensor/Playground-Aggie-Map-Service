import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { auth } from './routes/index';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();
const app: express.Express = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/auth', auth);

app.use(errorHandler);

const port: number = 3000 || process.env.PORT;

app.listen(port, () => {
    console.log(`server running on port: ${port}`);
});
