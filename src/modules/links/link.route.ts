import { Router } from "express";
import { link } from "node:fs";
import { linkController } from "./link.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { optionalAuth } from "../../middleware/optionalAuth.middleware";

const router = Router();

router.post("/create", optionalAuth, linkController.createLink);

router.get("/", authMiddleware, linkController.getUserLinks);

export const linkRoute = router;
