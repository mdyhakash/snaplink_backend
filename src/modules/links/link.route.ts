import { Router } from "express";
import { link } from "node:fs";
import { linkController } from "./link.controller";

const router = Router()

router.post('/create', linkController.createLink)


export const linkRoute = router