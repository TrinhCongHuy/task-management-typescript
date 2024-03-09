import { taskRouter } from "./task";
import { userRouter } from "./user";
import * as authMiddleware from "../middlewares/auth.middleware"


import { Express } from "express";

const mainV1Router = (app: Express): void => {
    const version: string = "/api/v1"
    app.use(version + '/tasks', authMiddleware.requireAuth, taskRouter)
    app.use(version + '/users', userRouter)

}

export default mainV1Router