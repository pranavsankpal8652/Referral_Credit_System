import { Request, Response } from "express";
import { UserModel } from "../model/UserModel";
import bcrypt from "bcrypt";
import { generate } from "referral-codes";
import JsonWebToken from "jsonwebtoken";
import { io } from "../../index"; // import the Socket.IO server instance
export const registerUser = (req: Request, res: Response) => {
  const data = req.body;
  // console.log(data);
  const saltRounds = 10;
  const hashedPassword = bcrypt.hashSync(data.password, saltRounds);
  data.password = hashedPassword;
  var referLink: string[] = [];
  try {
    referLink = generate({
      length: 7,
      count: 1,
      prefix: data.name.substring(0, 4).toUpperCase(),
      charset: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    });
    data.referralCode = referLink[0];
  } catch (err) {
    console.log(err);
  }
  // console.log(data)
  UserModel.create(data)
    .then((Response) => {
      if (Response.referredBy) {
        UserModel.findOneAndUpdate(
          { referralCode: Response.referredBy },
          {
            $push: { referredUser: { user: Response._id, status: "pending" } },
          },
          { new: true }
        )
          .then((referrer) => {
            console.log("Referring user updated with referred user");
            if (referrer) {
              // console.log(
              //   "Emitting Socket.IO event to referring user",
              //   referrer
              // );
              io.to(referrer._id.toString()).emit("UserUpdated", {
                user: {
                  id: referrer._id,
                  name: referrer.name,
                  email: referrer.email,
                  credits: referrer.credits,
                  referralCode: referrer.referralCode,
                  referredUsers: referrer.referredUser,
                },
              });
            }
          })
          .catch((err) => {
            console.log(
              "Error updating referring user with referred user: " + err
            );
          });
      }
      res.status(200).json({ msg: "User registered successfully" });
    })
    .catch((err) => {
      res.status(500).send("Error registering user: " + err);
      console.log(err);
    });
};

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send("Invalid password");
      }
      // console.log(user)
      JsonWebToken.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" },
        (err, token) => {
          if (err) {
            return res.status(500).send("Error generating token: " + err);
          }
          res.cookie("authToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
          });

          res.status(200).json({
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              credits: user.credits,
              referralCode: user.referralCode,
              referredUsers: user.referredUser,
            },
            msg: "User logged in successfully",
          });
        }
      );
    })
    .catch((err) => {
      res.status(500).send("Error logging in user: " + err);
    });
};

export const logoutUser = (req: Request, res: Response) => {
  // console.log("Logout request received");
  if (!req.cookies || !req.cookies.authToken) {
    console.log("No authToken cookie found");
    return res.status(400).send("No user is logged in");
  }
  // console.log('hasCookie')
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  res.status(200).send("User logged out successfully");
};
