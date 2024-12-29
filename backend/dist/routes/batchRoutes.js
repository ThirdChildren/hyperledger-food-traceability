"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const batchController_1 = require("../controllers/batchController");
const router = (0, express_1.Router)();
router.post("/batch", batchController_1.createBatch);
router.get("/batch/:id", batchController_1.getBatchById);
router.put("/batch", batchController_1.updateBatchState);
exports.default = router;
