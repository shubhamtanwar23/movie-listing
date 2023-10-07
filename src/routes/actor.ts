import { Router } from "express";
import { getActorController } from "../controllers/actors";
import authentication from "../middlewares/authentication";

const router = Router();

router.use(authentication);

router.get("/actor", getActorController);

export { router as actorRouter };
