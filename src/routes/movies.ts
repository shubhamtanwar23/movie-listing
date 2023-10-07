import { Router } from "express";
import {
  addMovieController,
  deleteMovieController,
  getMoviesController,
  updateMovieController,
} from "../controllers/movies";
import authentication from "../middlewares/authentication";
import { movieValidateSchema } from "../validations/movies";

const router = Router();

router.use(authentication);

router.get("/movies", getMoviesController);
router.post("/movies", movieValidateSchema, addMovieController);
router.put("/movie/:movieId", movieValidateSchema, updateMovieController);
router.delete("/movie/:movieId", deleteMovieController);

export { router as moviesRouter };
