import { Router } from "express";
import {
  createBatch,
  getBatchById,
  updateBatchState,
  getAllBatches,
  getBatchHistory,
} from "../controllers/batchController";

const router = Router();

router.post("/batch", createBatch);
router.get("/batch/:id", getBatchById);
router.put("/batch", updateBatchState);
router.get("/batches", getAllBatches);
router.get("/batch/history/:id", getBatchHistory);

export default router;
