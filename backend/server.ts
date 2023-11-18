import express from 'express';
import {router} from './api';
const app = express();
const port = 3000;


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', router)

app.get("/", (req: express.Request, res: express.Response)=> {
    res.send('Hello world')
})



app.listen(port, ()=> {
    console.log(`Le serveur tourne à l'adresse http://localhost:${port}`)
})




