import { hash } from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { JWTToken, saltRounds } from "../config";
import { prismaClient } from "../db";

export const registerController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send({
      success: false,
      errors: errors.array(),
    });
  }

  const exists = await prismaClient.user.findFirst({
    where: { email: req.body.email },
  });

  if (exists) {
    return res.send({ success: false, message: "User already registered" });
  }

  const user = await prismaClient.user.create({
    data: {
      ...req.body,
      password: await hash(req.body.password, saltRounds),
    },
  });

  return res.send({
    success: true,
    message: "User registered successfully!",
    token: jwt.sign({ id: user.id }, JWTToken as string, {
      expiresIn: "1800s",
    }),
  });
};
