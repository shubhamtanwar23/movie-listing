import { Router } from "express";
import { addMovieController, getMoviesController } from "../controllers/movies";
import authentication from "../middlewares/authentication";
import { addMovieValidateSchema } from "../validations/movies";

const router = Router();

router.use(authentication);

router.get("/movies", getMoviesController);

export { router as moviesRouter };