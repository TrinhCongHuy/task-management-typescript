import { Router } from "express";
const router: Router = Router()

import * as controller from "../controllers/user.controller"
import * as authMiddleware from "../middlewares/auth.middleware"

router.post('/register', controller.register)

router.post('/login', controller.login)

router.post('/password/forgot', controller.forgotPassword)

router.post('/password/otp', controller.otpPassword)

router.post('/password/reset', controller.resetPassword)

router.get('/detail', authMiddleware.requireAuth, controller.detail)


export const userRouter: Router = router