import express, { Request, Response } from "express";

const app = express();
const port = process.env.PORT || 9000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
