import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWTToken } from "../config";

export default (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const authorizationHeader = req.get("authorization");
  if (!authorizationHeader) {
    req.logger.error("Missing authorization header");
    return res.status(401).send({ error: "Missing auth credentials" });
  }

  const [prefix, token] = authorizationHeader.split(" ");
  if (prefix !== "Token") {
    req.logger.error("Authorization header prefix invalid");
    return res.status(401).send({ error: "Invalid credentials" });
  }

  jwt.verify(token, JWTToken as string, async (error, payload) => {
    if (error) {
      req.logger.error("Token verification failed", { error });
      return res.status(401).send({ error: "Invalid credentials" });
    }

    // @ts-ignore
    req.userId = payload.userId;
    next();
  });
};
