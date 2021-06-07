import express from 'express';
import cors from 'cors';

const app: express.Express = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port: number = 3000 || process.env.PORT;

app.listen(port, () => {
    console.log(`server running on port: ${port}`);
});
