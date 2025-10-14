import { Router } from "express";
import {
  checkAuth,
  getUsers,
  userLogin,
  userLogout,
  userSignUp,
} from "../controller/userController";
import { userAuth } from "../utils/userAuth";

const userRouter = Router();

userRouter.post("/signup", userSignUp);
userRouter.post("/login", userLogin);
userRouter.post("/logout", userAuth, userLogout);
userRouter.get("/currentUser", userAuth, checkAuth);
userRouter.get("/allUsers", userAuth, getUsers);

export default userRouter;
