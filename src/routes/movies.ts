import { Router } from "express";
import {
  addMovieController,
  deleteMovieController,
  getMoviesController,
} from "../controllers/movies";
import authentication from "../middlewares/authentication";
import { addMovieValidateSchema } from "../validations/movies";

const router = Router();

router.use(authentication);

router.get("/movies", getMoviesController);
router.post("/movies", addMovieValidateSchema, addMovieController);
router.delete("/movie/:movieId", deleteMovieController);

export { router as moviesRouter };
