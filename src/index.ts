import express, { Request, Response } from "express";
import { registerValidateSchema } from "./validations/register";
import { registerController } from "./controllers/register";

const port = process.env.PORT || 9000;
const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.post("/api/register", registerValidateSchema, registerController);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
