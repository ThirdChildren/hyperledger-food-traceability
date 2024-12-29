import { Router } from "express";
import {
  createBatch,
  getBatchById,
  updateBatchState,
} from "../controllers/batchController";

const router = Router();

router.post("/batch", createBatch);
router.get("/batch/:id", getBatchById);
router.put("/batch", updateBatchState);

export default router;
