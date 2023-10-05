import express, { Request, Response } from "express";
import { Logger } from "winston";

import { registerValidateSchema } from "./validations/register";
import { registerController } from "./controllers/register";
import { loginValidateSchema } from "./validations/login";
import { loginController } from "./controllers/login";
import { moviesRouter } from "./routes/movies";
import loggerMiddleware from "./middlewares/logger";

declare global {
  namespace Express {
    export interface Request {
      logger: Logger;
      userId: number;
    }
  }
}

const port = process.env.PORT || 9000;
const app = express();
app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/register", registerValidateSchema, registerController);
app.post("/api/login", loginValidateSchema, loginController);
app.use("/api", moviesRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
