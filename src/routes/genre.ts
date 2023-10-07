import { Router } from "express";
import { getGenreController } from "../controllers/genre";
import authentication from "../middlewares/authentication";

const router = Router();

router.use(authentication);

router.get("/genre", getGenreController);

export { router as genreRouter };
