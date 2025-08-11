import express from 'express';
import cors from 'cors';
import treeRouter from './routes/api/tree.js';


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/tree', treeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
