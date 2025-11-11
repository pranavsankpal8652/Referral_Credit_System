import Jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   console.log("verifying");
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }
  try {
    const decoded = Jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(500).send("Internal Server Error: " + err);
  }
};

// Note: Ensure to import JsonWebToken from 'jsonwebtoken' at the top of the file
