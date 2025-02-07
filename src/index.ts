import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { port } from "./config"
import * as morgam from 'morgan'
import { validationResult } from "express-validator"

function handleErrors(err,req,res,next){
    res.status(err.status || 500).send({message:err.message});
}
AppDataSource.initialize().then(async () => {
    
    // create express app
    const app = express()
    app.use(morgam('tiny'))
    app.use(bodyParser.json())

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route,
            ...route.validation,
            async (req: Request, res: Response, next: Function) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                  return res.status(400).json({errors:errors.array()})
                }

                const result = await (new (route.controller as any))[route.action](req, res, next)
                res.json(result)
            } catch (error) {
                next(error);
            }
        })
    })

    app.use(handleErrors)
    app.listen(port)

    console.log(`Express server has started on port ${port}. Open http://localhost:3000/users to see results`)

}).catch(error => console.log(error))
