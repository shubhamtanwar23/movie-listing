import winston from "winston";

import packageJson from "../package.json";
import { LogLevel } from "./config";

export const logger = winston.createLogger({
  level: LogLevel,
  format: winston.format.json(),
  defaultMeta: { service: packageJson.name, version: packageJson.version },
  transports: [new winston.transports.Console()],
});
