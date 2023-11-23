import express from 'express';
import {router} from './api';
const app = express();
const port = 3000;
import bodyParser from 'body-parser';


// parse application/json qui permet de parser les requêtes envoyées au format JSON
app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', router)
app.use(express.static('public'))


app.get("/", (req: express.Request, res: express.Response)=> {
    res.send('Hello world')
})




// Démarrer le serveur
app.listen(port, ()=> {
    console.log(`Le serveur tourne à l'adresse http://localhost:${port}`)
})




