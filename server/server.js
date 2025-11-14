import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import { clerkMiddleware } from '@clerk/express'
import showRouter from './Routes/showRouter.js';


const app = express();
const port = 3000;

await connectDB()


//middleware

app.use(express.json())

app.use(cors())

app.use(clerkMiddleware())


//Api Routes

app.get('/', (req, res)=> res.send('Server is Live'))
app.use('/api/inggest',  serve({ client: inngest, functions }))
app.use('/api/show', showRouter)

app.listen(port, ()=> console.log(  `Server listening at http://localhost:${port}`));