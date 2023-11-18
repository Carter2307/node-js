import express from "express";
import db from '../db.json';
import * as schema from './schema'
import {InferType} from "yup";
import {userSchema} from "./schema";
import * as fs from "fs";


type User =  InferType<typeof userSchema>

const router  = express.Router()
const data:{users: User[]} = db

// -> /api/users
router.get("/users", (req:express.Request, res: express.Response) => {
    res.send(db.users)
})

// -> /api/
router.post("/user", async (req:express.Request, res: express.Response) => {
    const {id, role, email, password}= req.body

    if(id == "" || role == "" || email == "" || password == "") {
        return res.send({
            status: 400,
            message : "Des champs semblent vides ou incorrect"
        })
    }

    const user=await schema.userSchema.validate({
        id, role, email, password
    })


    data.users.push(user)

    //Mettre à jour la base de donnée
    fs.writeFile('./db.json', JSON.stringify(data), (err) => {
        if(err) throw err;
        console.log("database was updated")
    })

    res.send(user)

})






export {router}