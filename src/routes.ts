import express, { Router, Request, Response } from "express";
import { PostgrestResponse } from "@supabase/supabase-js"; // Import the PostgrestResponse type
import supabase from "./db"; // Assuming you've set up the Supabase client in db.js

const router: Router = express.Router();

const MEXICAN_TRAIN_TABLE_NAME = "mexican-train";

// Main route
router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the main route of my TypeScript NodeJS backend!");
});

// Mexican Train route with CRUD operations
router
  .route("/mexican-train")
  // Get all Mexican Train data
  .get(async (req: Request<{ id: string; readableId: string }>, res: Response) => {
    try {
      const idColumnToLookup = req.query.id ? 'id' : 'readableId';
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
  })
  // Create a new Mexican Train record
  .post(async (req: Request, res: Response) => {
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
  })
  // Update a Mexican Train record by ID
  .put(async (req: Request<{ id: string }>, res: Response) => {
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
  })
  // Delete a Mexican Train record by ID
  .delete(async (req: Request<{ id: string }>, res: Response) => {
    console.log({ req });
    res.status(501).send("Deleting Mexican Train record not implemented");
  });

// Catch-all route for 404 errors within this specific routes file
router.use((req: Request, res: Response) => {
  res.status(404).send("404 - Not Found within routes.ts");
});

export default router;
