import express from 'express';
import {router} from './api';
const app = express();
const port = 3000;
import bodyParser from 'body-parser';


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', router)
app.use(express.static('public'))


app.get("/", (req: express.Request, res: express.Response)=> {
    res.send('Hello world')
})





app.listen(port, ()=> {
    console.log(`Le serveur tourne à l'adresse http://localhost:${port}`)
})




