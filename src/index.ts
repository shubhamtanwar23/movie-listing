import express, { Request, Response } from "express";
import { registerValidateSchema } from "./validations/register";
import { registerController } from "./controllers/register";
import { loginValidateSchema } from "./validations/login";
import { loginController } from "./controllers/login";

const port = process.env.PORT || 9000;
const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/register", registerValidateSchema, registerController);
app.post("/api/login", loginValidateSchema, loginController);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
