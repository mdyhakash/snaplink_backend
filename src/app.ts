import express, { type Request, type Response } from "express";
import { linkRoute } from "./modules/links/link.route";
import { linkController } from "./modules/links/link.controller";
import { authRoute } from "./modules/auth/auth.route";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/link", linkRoute);
app.use("/api/auth", authRoute);

app.use("/:short_code", linkController.redirectLink);

export default app;
