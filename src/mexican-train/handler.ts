import { Request, Response } from "express";
import { PostgrestResponse } from "@supabase/supabase-js";
import supabase from "../db";
import { MexicanTrainGameConfig, ScoresByPlayer } from "./interfaces";

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
  req: Request<any, any, { id: string; scores: object }>,
  res: Response
) => {
  try {
    const id: string = req?.query?.id as string;
    const scores: string = req?.query?.scores as string;
    if (!id || !scores) {
      res
        .status(400)
        .send("Invalid request. Id and Scores are required.");
      return;
    }  
    const jsonScores: ScoresByPlayer = JSON.parse(scores);
    if (!isScoresValid(jsonScores)) {
      res
        .status(400)
        .send("Invalid request. Scores are not valid.");
      return;
    }

    const updatedRound = jsonScores[Object.keys(jsonScores)[0]].length + 1;

    const { data, error }: PostgrestResponse<any> = await supabase
      .from(MEXICAN_TRAIN_TABLE_NAME)
      .update({
        scores: jsonScores,
        currentRound: updatedRound,
      })
      .match({ id: id });

    if (error) {
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error("Error updating Mexican Train record:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

function isScoresValid(scores: ScoresByPlayer): boolean {
  const values = Object.values(scores);
  const firstPlayer = values[0];
  const firstPlayerRounds = firstPlayer.map((score) => score.round);
  values.forEach((playerScores) => {
    const rounds = playerScores.map((score) => score.round);
    if (!arraysHaveSameValuesAndLength(firstPlayerRounds, rounds)) {
      return false;
    }
    if (firstPlayer.length !== playerScores.length) {
      return false;
    }
  });
  return true;
}

function arraysHaveSameValuesAndLength<T>(array1: T[], array2: T[]): boolean {
  // Check if both arrays have the same length
  if (array1.length !== array2.length) {
    return false;
  }
  // Create copies of the arrays to avoid modifying the original arrays
  const copy1 = [...array1];
  const copy2 = [...array2];
  // Sort the copied arrays
  copy1.sort();
  copy2.sort();
  // Compare the sorted arrays element by element
  for (let i = 0; i < copy1.length; i++) {
    if (copy1[i] !== copy2[i]) {
      return false;
    }
  }
  return true;
}

export const deleteMexicanTrainHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  res.status(501).send("Deleting Mexican Train record not implemented");
};
