import { Request, Response } from "express";

import { prismaClient } from "../db";
import { PAGE_SIZE } from "../constants";

export const getGenreController = async (req: Request, res: Response) => {
  const { size, page, q } = req.query;
  const pageSize = parseInt((size as string) || PAGE_SIZE, 10);
  const skip = pageSize * (parseInt((page as string) || "1", 10) - 1);

  const genres = await prismaClient.genre.findMany({
    take: pageSize,
    skip,
    where: { title: { contains: q as string, mode: "insensitive" } },
    orderBy: {
      title: "asc",
    },
  });

  res.send({
    success: true,
    genres,
  });
};
