import { authenticateToken } from './../middlewares/authenticateToken';
import { Router } from "express"
import { signup, Adminsignup, getAllUsers, login, refreshToken, logout } from "../controllers/auth.controller"
import { authorizeRole } from '../middlewares/authorizeRole';

const authRouter = Router()

authRouter.post("/signup", signup) // POST /api/auth/signup
authRouter.post("/admin/signup",  authenticateToken, authorizeRole("admin"), Adminsignup) // POST /api/auth/admin/signup
authRouter.post("/login", login)
// authRouter.get("/users", authenticateToken, getAllUsers) // GET /api/auth/users
authRouter.get("/users", getAllUsers) // GET /api/auth/users
authRouter.post("/refresh-token", refreshToken)
authRouter.post("/logout", logout)
export default authRouter
