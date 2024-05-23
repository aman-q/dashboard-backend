import express from 'express';
import connectDB from './db/conn.js';
import cors from 'cors';
import Router from './routes/router.js';

const app = express();
const PORT = proces.env.PORT || 8001
app.use(cors());
app.use(express.json());
app.use('/api/users', Router);

const startServer = async () => {
    await connectDB(); 

    app.listen(PORT, () => {
        console.log("Server is running on port 8001");
    });
};

startServer();
