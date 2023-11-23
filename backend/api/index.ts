import express from "express";
import db from '../db.json';
import * as schema from './schema'
import {InferType} from "yup";
import {courseSchema, userSchema, studentCourseSchema} from "./schema";
import * as fs from "fs";


type User =  InferType<typeof userSchema>
type Course = InferType<typeof courseSchema>
type StudentCourse = InferType<typeof studentCourseSchema>
type Data = {users: User[], courses: Course[], studentCourses: StudentCourse[]}

const router  = express.Router()
const data: Data = db

router.post("/login", (req: express.Request, res: express.Response) => {
    const {email, password } = req.body

    if(email=="" || password == "") {
        return res.status(400).send({
            message: "L'un des champ semble vide"
        })
    }

    let users: User[]= []

    data.users.forEach(u => {
        if(u.email == email) {
            users.push(u)
        }
    })

    let user: User = users[0]

    if(user === null || user === undefined) {
        return res.status(400).send({
            message: "Aucun utilisateur trouvé"
        })
    }

    if(user.password !== password) {
        return res.status(400).send({
            message: "Mot de passe incorrect"
        })
    }

    res.status(200).send({
        data: user,
        message: "Utilisateur connecté"
    })
})

// -> /api/users
router.get("/users", (req:express.Request, res: express.Response) => {
    res.send(db.users)
})

// -> /api/courses
router.get("/courses", (req: express.Request, res: express.Response) => {
    res.send(db.courses)
} )

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


router.post("/course", async (req:express.Request, res: express.Response) => {
    const {title, students}= req.body

    if(title == "" || students == "") {
        return res.send({
            status: 400,
            message : "Des champs semblent vides ou incorrect"
        })
    }

    //Get the id of the last item of courses array and increment
    const id = data.courses[data.courses.length - 1].id + 1

   const studentsId = students.split(",").map((str: string) => parseInt(str))

   const course = await schema.courseSchema.validate({
        id, title, date: Date.now(), students : studentsId
    })



   data.courses.push(course)

    //Mettre à jour la base de donnée
    updateDatabase(data, res);

})

router.post('/asign', async (req:express.Request, res: express.Response) => {
    const {studentId, courseId } = req.body

    if(studentId == "" || courseId =="") {
        return res.send({
            status: 400,
            message : "Des champs semblent vides ou incorrect"
        })
    }


    let course  = data.courses.filter(course => course.id == parseInt(courseId))[0]
    course.students.push(parseInt(studentId))
    data.courses.splice(courseId - 1)
    data.courses.push(course)

    let studentCourse = {
        studentId, courseId, signedAt : 0, registeredAt : Date.now()
    }

    data.studentCourses.push(await schema.studentCourseSchema.validate(studentCourse))
    updateDatabase(data, res)

})


router.post('/sign', (req:express.Request, res: express.Response) => {
    const {studentId, courseId } = req.body

    if(studentId == "" || courseId =="") {
        return res.send({
            status: 400,
            message : "Des champs semblent vides ou incorrect"
        })
    }

    const studentCourse = data.studentCourses.filter((t) => t.courseId == courseId && t.studentId == studentId)[0]
    studentCourse.signedAt = Date.now()
    data.studentCourses.splice(courseId - 1)
    data.studentCourses.push(studentCourse)
    updateDatabase(data, res)
})


function updateDatabase(data: Data, res: express.Response) {

    //Mettre à jour la base de donnée
    fs.writeFile('./db.json', JSON.stringify(data), (err) => {
        if(err) throw err;
        console.log("database was updated")
        //Return the last added course to user
        res.send(data.courses[data.courses.length -1])
    })
}





export {router}