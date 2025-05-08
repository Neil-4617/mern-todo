// dependencies
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import todoRoutes from './routes/Todo.route.js';

dotenv.config();
const port = process.env.PORT || 5000;

// initialize express
const app = express();
app.use(express.json());

// routes
app.use("/api/todos", todoRoutes);

// database connection.
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.once('open', () => {
    console.log('Now connected to local MongoDB server.')
});

// middleware cors enable
app.use(cors())

// listen
app.listen(port, () =>{
    console.log(`Server is running at http://localhost:${port}`);
});