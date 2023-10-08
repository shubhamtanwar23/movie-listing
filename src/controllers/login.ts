import { compare } from "bcrypt";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { JWTToken } from "../config";
import { prismaClient } from "../db";

export const loginController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.logger.error("loginController: validation error", {
      error: errors.array(),
    });
    return res.status(400).send({
      success: false,
      errors: errors.array(),
    });
  }

  const user = await prismaClient.user.findFirst({
    where: { email: req.body.email },
  });

  if (!user) {
    req.logger.info(
      `loginController: User with ${req.body.email} doesn't exists`
    );
    return res
      .status(404)
      .send({ success: false, error: "User not registered" });
  }
  req.logger.debug("loginController: User found", { user });

  // verify password
  if (await compare(req.body.password, user.password)) {
    return res.send({
      success: true,
      message: "Logged in successfully!",
      token: jwt.sign({ userId: user.id }, JWTToken as string, {
        expiresIn: "1800s",
      }),
    });
  }

  req.logger.debug("loginController: password matching failed");
  return res.status(400).send({
    success: false,
    error: "Invalid email or password",
  });
};
