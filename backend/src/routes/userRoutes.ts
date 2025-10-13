import { Router } from "express";
import {
  userLogin,
  userLogout,
  userSignUp,
} from "../controller/userController";
import { userAuth } from "../utils/userAuth";

const userRouter = Router();

userRouter.post("/signup", userSignUp);
userRouter.post("/login", userLogin);
userRouter.post("/logout", userAuth, userLogout);

export default userRouter;
