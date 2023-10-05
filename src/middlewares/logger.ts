import { logger } from "../logger";
import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export default (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  req.logger = logger.child({
    path: req.path,
    method: req.method,
    requestId: uuidv4(),
  });

  req.logger.info(`Received request to ${req.path}`, {
    query: req.query,
    params: req.params,
    body: req.body,
    headers: req.headers,
    method: req.method,
    url: req.baseUrl,
  });

  res.on("finish", () => {
    const logMessage = `Response sent with status ${res.statusCode}`;
    if (res.statusCode >= 400) {
      req.logger.error(logMessage);
    } else {
      req.logger.info(logMessage);
    }
  });
  next();
};
