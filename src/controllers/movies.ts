import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { prismaClient } from "../db";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";

const checkIfAllCastAreValid = async (cast: number[]) => {
  const validActorIdCount = await prismaClient.actor.count({
    where: { id: { in: cast } },
  });
  if (validActorIdCount !== cast.length) {
    return [false, validActorIdCount];
  }
  return [true, validActorIdCount];
};

const checkIfAllGenreAreValid = async (genre: number[]) => {
  const validGenreCount = await prismaClient.genre.count({
    where: { id: { in: genre } },
  });
  if (validGenreCount !== genre.length) {
    return [false, validGenreCount];
  }
  return [true, validGenreCount];
};

export const getMoviesController = async (req: Request, res: Response) => {
  const pageSize = parseInt((req.query.size as string) || PAGE_SIZE, 10);
  const queryOption: Prisma.MovieFindManyArgs = {
    take: pageSize,
    where: { userId: req.userId },
    orderBy: {
      id: "asc",
    },
    include: {
      cast: true,
      genre: true,
    },
  };

  if (req.query.cursor) {
    queryOption.cursor = {
      id: parseInt(req.query.cursor as string, 10),
    };
    queryOption.skip = 1;
  }

  const movies = await prismaClient.movie.findMany(queryOption);

  res.send({
    success: true,
    movies,
    cursor: movies.length < pageSize ? null : movies[movies.length - 1]?.id,
  });
};

export const addMovieController = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.logger.error("addMovieController: validation error", {
      error: errors.array(),
    });
    return res.status(400).send({
      success: false,
      errors: errors.array(),
    });
  }

  const { name, rating, releasedOn, cast, genre } = req.body;

  const [castValid, validActorIdCount] = await checkIfAllCastAreValid(cast);
  if (!castValid) {
    req.logger.error(
      `addMovieController: Found only ${validActorIdCount} actors in DB. ${cast.length} were sent in request`
    );
    return res
      .status(400)
      .send({ success: false, error: "Invalid actor selected in cast" });
  }

  const [validGenre, validGenreCount] = await checkIfAllGenreAreValid(genre);
  if (!validGenre) {
    req.logger.error(
      `addMovieController: Found only ${validGenreCount} genre in DB. ${genre.length} were sent in request`
    );

    return res
      .status(400)
      .send({ success: false, error: "Invalid genre selected" });
  }

  try {
    const movie = await prismaClient.movie.create({
      data: {
        name,
        rating,
        releasedOn,
        cast: {
          connect: cast.map((actorId: number) => ({
            id: actorId,
          })),
        },
        genre: {
          connect: genre.map((genreId: number) => ({
            id: genreId,
          })),
        },
        user: {
          connect: { id: req.userId },
        },
      },
      include: {
        cast: true,
        genre: true,
      },
    });
    req.logger.debug("addMovieController: created movie successfully", {
      movie,
    });
    res.send({ success: true, movie });
  } catch (error) {
    req.logger.error("addMovieController: failed to create movie", { error });
    res.status(500).send({
      success: false,
      // @ts-ignore
      error: error.message || "Something went wrong",
    });
  }
};

export const updateMovieController = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const id = parseInt(movieId, 10);
  if (isNaN(id)) {
    return res.status(400).send({ success: false, error: "Invalid Movie ID" });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.logger.error("updateMovieController: validation error", {
      error: errors.array(),
    });
    return res.status(400).send({
      success: false,
      errors: errors.array(),
    });
  }

  const { name, rating, releasedOn, cast, genre } = req.body;

  const [castValid, validActorIdCount] = await checkIfAllCastAreValid(cast);
  if (!castValid) {
    req.logger.error(
      `updateMovieController: Found only ${validActorIdCount} actors in DB. ${cast.length} were sent in request`
    );
    return res
      .status(400)
      .send({ success: false, error: "Invalid actor selected in cast" });
  }

  const [genreValid, validGenreCount] = await checkIfAllGenreAreValid(genre);
  if (!genreValid) {
    req.logger.error(
      `updateMovieController: Found only ${validGenreCount} genre in DB. ${genre.length} were sent in request`
    );

    return res
      .status(400)
      .send({ success: false, error: "Invalid genre selected" });
  }

  try {
    const movie = await prismaClient.movie.update({
      where: { id },
      data: {
        name,
        rating,
        releasedOn,
        cast: {
          set: [],
          connect: cast.map((actorId: number) => ({
            id: actorId,
          })),
        },
        genre: {
          set: [],
          connect: genre.map((genreId: number) => ({
            id: genreId,
          })),
        },
      },
      include: {
        cast: true,
        genre: true,
      },
    });
    req.logger.debug("updateMovieController: created movie successfully", {
      movie,
    });
    res.send({ success: true, movie });
  } catch (error) {
    req.logger.error("updateMovieController: failed to create movie", {
      error,
    });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2016") {
        return res
          .status(404)
          .send({ success: false, error: "Movie not found" });
      }
      return res.status(500).send({ success: false, error: error.message });
    }
    return res
      .status(500)
      .send({ success: false, error: "Something went wrong" });
  }
};

export const deleteMovieController = async (req: Request, res: Response) => {
  const { movieId } = req.params;
  const id = parseInt(movieId, 10);
  if (isNaN(id)) {
    return res.status(400).send({ success: false, error: "Invalid Movie ID" });
  }

  try {
    await prismaClient.movie.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    req.logger.error("deleteMovieController: Query failed", { error });
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return res
          .status(404)
          .send({ success: false, error: "Movie not found" });
      }
      return res.status(500).send({ success: false, error: error.message });
    }
    return res
      .status(500)
      .send({ success: false, error: "Something went wrong" });
  }
};
