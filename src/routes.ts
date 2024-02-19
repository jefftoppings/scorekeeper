import express, { Router, Request, Response } from "express";
import {
  getMexicanTrainHandler,
  postMexicanTrainHandler,
  putMexicanTrainHandler,
  deleteMexicanTrainHandler,
} from "./mexican-train/handler";

const router: Router = express.Router();

// Main route
router.get("/", (req: Request, res: Response) => {
  res.send("Hello from the main route of my TypeScript NodeJS backend!");
});

// Mexican Train route with CRUD operations
router
  .route("/mexican-train")
  // Get all Mexican Train data
  .get(getMexicanTrainHandler)
  // Create a new Mexican Train record
  .post(postMexicanTrainHandler)
  // Update a Mexican Train record by ID
  .put(putMexicanTrainHandler)
  // Delete a Mexican Train record by ID
  .delete(deleteMexicanTrainHandler);

// Catch-all route for 404 errors within this specific routes file
router.use((req: Request, res: Response) => {
  res.status(404).send("404 - Not Found within routes.ts");
});

export default router;
