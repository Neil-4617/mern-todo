// dependencies
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 5000;

// initialize express
const app = express();

app.get("/", (req, res) =>{
    res.send("Server is ready");
});

// cors enable
app.use(cors())


// listen
app.listen(port, () =>{
    console.log(`Server is running at http://localhost:${port}`);
});