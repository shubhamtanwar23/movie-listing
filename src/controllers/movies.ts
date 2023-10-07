import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { prismaClient } from "../db";
import { Prisma } from "@prisma/client";
import { PAGE_SIZE } from "../constants";

export const getMoviesController = async (req: Request, res: Response) => {
  const pageSize = parseInt((req.query.size as string) || PAGE_SIZE, 10);
  const queryOption: Prisma.MovieFindManyArgs = {
    take: pageSize,
    where: { userId: req.userId },
    orderBy: {
      id: "asc",
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
