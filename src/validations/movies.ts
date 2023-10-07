import { checkSchema } from "express-validator";

export const addMovieValidateSchema = checkSchema({
  name: {
    exists: { errorMessage: "Movie name is required", bail: true },
    isString: { errorMessage: "Movie name should be string" },
  },
  rating: {
    exists: { errorMessage: "Rating is required", bail: true },
    isInt: {
      errorMessage: "Rating should be a number between 1 and 10",
      options: { min: 1, max: 10 },
    },
  },
  releasedOn: {
    exists: {
      errorMessage: "Release date of movie is required",
      bail: true,
    },
    isISO8601: {
      errorMessage: "Mention released on date in YYYY-MM-DDTHH:MM:SSZ format",
    },
  },
  cast: {
    exists: { errorMessage: "Cast in movie is compulsory", bail: true },
    isArray: {
      errorMessage: "Cast should be an array of actors",
      options: { min: 1 },
      bail: true,
    },
    custom: {
      options: (values) => {
        if (!values.every(Number.isInteger)) {
          throw new Error("Provide valid actor in cast");
        }
        return true;
      },
    },
  },
  genre: {
    exists: { errorMessage: "Genre of movie is compulsory", bail: true },
    isArray: {
      errorMessage: "Genre should be an array",
      options: { min: 1 },
      bail: true,
    },
    custom: {
      options: (values) => {
        if (!values.every(Number.isInteger)) {
          throw new Error("Provide a valid genre");
        }
        return true;
      },
    },
  },
});
