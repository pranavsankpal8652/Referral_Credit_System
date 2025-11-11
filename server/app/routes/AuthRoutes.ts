import  { Request, Response } from "express";

import { loginUser, logoutUser, registerUser } from "../controller/AuthController";
export const AuthRoutes = require("express").Router();
// Register Route
AuthRoutes.post("/register",registerUser);
// Login Route
AuthRoutes.post("/login", loginUser);   
AuthRoutes.post("/logout", logoutUser);             

