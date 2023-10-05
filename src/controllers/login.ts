import { compare } from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { JWTToken } from "../config";
import { prismaClient } from "../db";

export const loginController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      errors: errors.array(),
    });
  }

  const user = await prismaClient.user.findFirst({
    where: { email: req.body.email },
  });

  if (!user) {
    return res
      .status(404)
      .send({ success: false, message: "User not registered" });
  }

  // verify password
  if (await compare(req.body.password, user.password)) {
    return res.send({
      success: true,
      message: "Logged in successfully!",
      token: jwt.sign({ id: user.id }, JWTToken as string, {
        expiresIn: "1800s",
      }),
    });
  }

  return res.status(400).send({
    success: false,
    message: "Invalid email or password",
  });
};
