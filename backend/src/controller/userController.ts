import { Request, Response } from "express";
import User from "../model/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserAuthI } from "../utils/userAuth";
import { Op } from "sequelize";

export const userSignUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    console.log(username, email, password);

    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields are required!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!user) return res.status(404).json({ error: "User not created!" });

    res.status(201).json({
      message: "User created",
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.log("[Error in userSignUp ]", error);
    res.status(500).json({ error: "Internal server Error!" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "All fields are required!" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials!" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Login successfully!" });
  } catch (error) {
    console.log("[Error in userLogin ]", error);
    res.status(500).json({ error: "Internal server Error!" });
  }
};

export const userLogout = (req: UserAuthI, res: Response) => {
  try {
    const email = req.user?.email;
    if (!email) return res.status(401).json({ error: "Email not found!" });
    res.clearCookie("token");
    res.json({ message: "Logged out" });
  } catch (error) {
    console.log("[Error in userLogout ]", error);
    res.status(500).json({ error: "Internal server Error!" });
  }
};

export const checkAuth = async (req: UserAuthI, res: Response) => {
  console.log(req.body);
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized!!!" });
    }
    const { id, email } = req.user;

    const user = await User.findOne({ where: { email } });

    if (!user) res.status(404).json({ message: "User not found!!!" });

    res.status(200).json({
      id,
      email,
      username: user.username,
    });
    console.log(user);
  } catch (error) {
    console.error("Error in currentUser:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getUsers = async (req: UserAuthI, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized!!!" });
    }
    const { id } = req.user;
    const users = await User.findAll({
      where: {
        id: {
          [Op.ne]: id,
        },
      },
    });
    res.status(200).json({
      users,
    });
  } catch (error) {
    console.error(error);
    console.error("Error in currentUser:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
