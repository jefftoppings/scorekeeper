import { Request, Response } from "express";
import { PostgrestResponse } from "@supabase/supabase-js";
import supabase from "../db";
import { MexicanTrainGameConfig } from "./interfaces";

const { v4: uuidv4 } = require("uuid");
const MEXICAN_TRAIN_TABLE_NAME = "mexican-train";

export const getMexicanTrainHandler = async (
  req: Request<{ id: string; readableId: string }>,
  res: Response
) => {
  try {
    const idColumnToLookup = req.query.id ? "id" : "readableId";
    const idToLookup = req.query.id || req.query.readableId;
    const { data, error }: PostgrestResponse<any> = await supabase
      .from(MEXICAN_TRAIN_TABLE_NAME)
      .select("*")
      .eq(idColumnToLookup, idToLookup)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      res.status(404).send("Record not found for id");
      return;
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching Mexican Train:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const postMexicanTrainHandler = async (
  req: Request<{ readableId: string; players: string[] }>,
  res: Response
) => {
  const readableId = req?.query?.readableId;
  const players = req?.query?.players;
  if (!readableId || !players) {
    res
      .status(400)
      .send("Invalid request. ReadableId and Players are required.");
    return;
  }

  // Check if a row with the same "readableId" already exists
  const existingRow = await supabase
    .from(MEXICAN_TRAIN_TABLE_NAME)
    .select()
    .eq("readableId", readableId)
    .single();
  if (existingRow.data) {
    res
      .status(409)
      .send(`A record with the same readableId already exists: ${readableId}`);
    return;
  }

  const config: MexicanTrainGameConfig = {
    id: uuidv4(),
    readableId: readableId as string,
    created: new Date(),
    players: players as string[],
    currentRound: 1,
    scores: {},
  };

  try {
    const { data, error }: PostgrestResponse<any> = await supabase
      .from(MEXICAN_TRAIN_TABLE_NAME)
      .insert(config);
    if (error) {
      throw error;
    }

    res.json(config);
  } catch (error) {
    console.error("Error creating Mexican Train record:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const putMexicanTrainHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    console.log({ req });
    const { data, error }: PostgrestResponse<any> = await supabase
      .from(MEXICAN_TRAIN_TABLE_NAME)
      .update(req.body)
      .match({ id: req.params.id });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error updating Mexican Train record:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

export const deleteMexicanTrainHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  res.status(501).send("Deleting Mexican Train record not implemented");
};
