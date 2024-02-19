import { Request, Response } from "express";
import { PostgrestResponse } from "@supabase/supabase-js";
import supabase from "../db";

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

export const postMexicanTrainHandler = async (req: Request, res: Response) => {
  try {
    console.log({ req });
    const { data, error }: PostgrestResponse<any> = await supabase
      .from(MEXICAN_TRAIN_TABLE_NAME)
      .insert(req.body);

    if (error) {
      throw error;
    }

    res.json(data);
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
