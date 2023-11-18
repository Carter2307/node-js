import { object, string, number, date,array, InferType } from 'yup';


const userSchema = object({
    id: number().required(),
    role: string().required(),
    email: string().required(),
    password: string().required()
})

const courseSchema = object({
    id: number().required(),
    title: string().required(),
    date: string().required(),
    students: array().of(number()).required()
})

const studentCourseSchema = object({
    registredAt: string().required(),
    signedAt: string().required()
})


export {userSchema, courseSchema, studentCourseSchema}
