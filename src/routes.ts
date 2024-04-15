import { UserController } from "./controller/UserController"
import { body, param } from "express-validator"

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all",
    validation:[],

}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one",
    validation:[
        param('id').isInt().withMessage("Must be integer"),
    ]
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save",
    validation:[
        body('firstName').isString().withMessage("Must be String"),
        body('lastName').isString().withMessage("Must be String"),
        body('age').isInt({min:0}).withMessage("Must be positive integer"),
    ]
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove",
    validation:[
        param('id').isInt().withMessage("Must be integer")
    ]
}]